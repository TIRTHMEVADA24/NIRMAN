import { prisma } from '../config/database.js';
import { UpdateManufacturerProfileInput, SubmitVerificationInput } from '../schemas/manufacturer.schema.js';

export class ManufacturerService {
  /**
   * Get public list of manufacturers with search and filters.
   */
  static async getManufacturers(filters: { search?: string; verificationStatus?: string; city?: string }) {
    const whereClause: any = {};

    if (filters.verificationStatus) {
      whereClause.verificationStatus = filters.verificationStatus;
    }

    if (filters.city) {
      whereClause.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.search) {
      whereClause.OR = [
        { factoryName: { contains: filters.search, mode: 'insensitive' } },
        { user: { companyName: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    try {
      return await prisma.manufacturerProfile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              companyName: true,
            },
          },
        },
      });
    } catch (dbError) {
      console.warn('⚠️ Database query via Prisma failed, using Supabase REST gateway:', (dbError as Error).message);
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dylqlvwshrywdxzhdobe.supabase.co';
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHFsdndzaHJ5d2R4emhkb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTgwMjUsImV4cCI6MjEwODIzNDAyNX0.RFPXrFIJRXXyHxeqIklttjnnUD4dqrYq4HWr0JlvqhM';
      
      const res = await fetch(`${supabaseUrl}/rest/v1/manufacturer_profiles?select=*,user:users(id,name,email,phone,companyName)`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      });
      if (res.ok) {
        return await res.json();
      }
      throw dbError;
    }
  }

  /**
   * Get single manufacturer profile by ID.
   */
  static async getManufacturerById(id: string) {
    const profile = await prisma.manufacturerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
            products: true,
          },
        },
      },
    });

    if (!profile) {
      const error: any = new Error('Manufacturer profile not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return profile;
  }

  /**
   * Update current manufacturer profile.
   */
  static async updateProfile(userId: string, input: UpdateManufacturerProfileInput) {
    const profile = await prisma.manufacturerProfile.findUnique({ where: { userId } });

    if (!profile) {
      const error: any = new Error('Manufacturer profile not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const { certifications, ...rest } = input;

    return prisma.manufacturerProfile.update({
      where: { userId },
      data: {
        ...rest,
        certifications: certifications ? JSON.stringify(certifications) : undefined,
      },
    });
  }

  /**
   * Submit business registration/GST documents for verification.
   */
  static async submitVerification(userId: string, input: SubmitVerificationInput) {
    return prisma.manufacturerProfile.update({
      where: { userId },
      data: {
        verificationStatus: 'PENDING',
      },
    });
  }
}
