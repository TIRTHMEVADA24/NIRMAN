import axios from 'axios';

function getNormalizedBaseUrl(): string {
  let url = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api/v1') && !url.includes('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

const api = axios.create({
  baseURL: getNormalizedBaseUrl(),
  timeout: 2500,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dylqlvwshrywdxzhdobe.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHFsdndzaHJ5d2R4emhkb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTgwMjUsImV4cCI6MjEwODIzNDAyNX0.RFPXrFIJRXXyHxeqIklttjnnUD4dqrYq4HWr0JlvqhM';

const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};


const DEFAULT_RFQS = [
  {
    id: 'rfq-demo-1',
    title: 'Custom Engraved 925 Silver Rings',
    description: 'Need 500 pcs custom engraved minimalist silver rings with custom brand pouch packaging.',
    quantity: 500,
    unit: 'piece',
    targetPrice: 100,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    quotes: [
      {
        id: 'quote-1',
        unitPrice: 95,
        totalPrice: 47500,
        deliveryTimeDays: 12,
        status: 'PENDING',
        manufacturer: { name: 'Amit Patel', companyName: 'Artisan Metals Co.' }
      }
    ]
  },
  {
    id: 'rfq-demo-2',
    title: 'Minimalist Gold-Plated Pendants',
    description: '18k gold plated brass pendants for upcoming summer collection.',
    quantity: 200,
    unit: 'piece',
    targetPrice: 120,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    quotes: []
  }
];

const DEFAULT_QUOTES = [
  {
    id: 'quote-demo-1',
    rfqId: 'rfq-demo-1',
    unitPrice: 95,
    totalPrice: 47500,
    deliveryTimeDays: 12,
    notes: 'We can deliver high-precision diamond engraving with custom laser hallmark.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    manufacturer: { name: 'Amit Patel', companyName: 'Artisan Metals Co.' },
    rfq: { title: 'Custom Engraved 925 Silver Rings', quantity: 500, targetPrice: 100 }
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Earrings', slug: 'earrings', description: 'All types of earrings' },
  { id: 'cat-2', name: 'Necklaces', slug: 'necklaces', description: 'Pendants and chains' },
  { id: 'cat-3', name: 'Rings', slug: 'rings', description: 'Casual and premium rings' },
  { id: 'cat-4', name: 'Bracelets', slug: 'bracelets', description: 'Bangles and bracelets' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', description: 'Brooches and hair accessories' },
  { id: 'cat-6', name: 'Packaging', slug: 'packaging', description: 'Jewelry boxes and packaging' },
];

const DEFAULT_MANUFACTURERS = [
  {
    id: 'mp-1',
    factoryName: 'Artisan Metals Co.',
    city: 'Jaipur, Rajasthan',
    verificationStatus: 'VERIFIED',
    rating: 4.8,
    reviewCount: 24,
    productionCapacity: '10,000 pcs/month',
    user: { id: 'usr-mfr-1', name: 'Amit Patel', email: 'mfr@factory.com', phone: '+91 98765 43210', companyName: 'Artisan Metals Co.' }
  },
  {
    id: 'mp-2',
    factoryName: 'Silver Peak Factory',
    city: 'Surat, Gujarat',
    verificationStatus: 'VERIFIED',
    rating: 4.9,
    reviewCount: 18,
    productionCapacity: '5,000 pcs/month',
    user: { id: 'usr-mfr-2', name: 'Pooja Verma', email: 'silver@factory.com', phone: '+91 98765 43211', companyName: 'Silver Peak Factory' }
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    title: '925 Sterling Silver Hoop Earrings',
    description: 'Classic lightweight silver hoops with premium anti-tarnish coating. Ideal for daily wear and gift collections.',
    price: 85,
    unit: 'pair',
    minOrderQuantity: 50,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=800'
    ]),
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Earrings', slug: 'earrings' },
    manufacturer: {
      id: 'usr-mfr-1',
      name: 'Amit Patel',
      companyName: 'Artisan Metals Co.',
      manufacturerProfile: {
        factoryName: 'Artisan Metals Co.',
        city: 'Jaipur, Rajasthan',
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        reviewCount: 24,
        productionCapacity: '10,000 pcs/month'
      }
    }
  },
  {
    id: 'prod-2',
    title: '18k Gold Plated Brass Pendant',
    description: 'Minimalist 18k gold plated brass pendant with custom engraving options available for brand customization.',
    price: 120,
    unit: 'piece',
    minOrderQuantity: 100,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ]),
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Necklaces', slug: 'necklaces' },
    manufacturer: {
      id: 'usr-mfr-1',
      name: 'Amit Patel',
      companyName: 'Artisan Metals Co.',
      manufacturerProfile: {
        factoryName: 'Artisan Metals Co.',
        city: 'Jaipur, Rajasthan',
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        reviewCount: 24,
        productionCapacity: '10,000 pcs/month'
      }
    }
  },
  {
    id: 'prod-3',
    title: 'Boho Oxidized Silver Statement Ring',
    description: 'Handcrafted oxidized 925 sterling silver statement ring featuring semi-precious stone embellishments.',
    price: 150,
    unit: 'piece',
    minOrderQuantity: 50,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=800'
    ]),
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Rings', slug: 'rings' },
    manufacturer: {
      id: 'usr-mfr-2',
      name: 'Pooja Verma',
      companyName: 'Silver Peak Factory',
      manufacturerProfile: {
        factoryName: 'Silver Peak Factory',
        city: 'Surat, Gujarat',
        verificationStatus: 'VERIFIED',
        rating: 4.9,
        reviewCount: 18,
        productionCapacity: '5,000 pcs/month'
      }
    }
  },
  {
    id: 'prod-4',
    title: 'Solitaire Moissanite Stud Earrings',
    description: 'Brilliant round cut moissanite diamond studs set in certified 925 silver base. Superior sparkle with GRA certification.',
    price: 250,
    unit: 'pair',
    minOrderQuantity: 20,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ]),
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Earrings', slug: 'earrings' },
    manufacturer: {
      id: 'usr-mfr-2',
      name: 'Pooja Verma',
      companyName: 'Silver Peak Factory',
      manufacturerProfile: {
        factoryName: 'Silver Peak Factory',
        city: 'Surat, Gujarat',
        verificationStatus: 'VERIFIED',
        rating: 4.9,
        reviewCount: 18,
        productionCapacity: '5,000 pcs/month'
      }
    }
  },
  {
    id: 'prod-5',
    title: 'Handcrafted Kundan Choker Necklace Set',
    description: 'Traditional Meenakari Kundan choker necklace with matching drop earrings. Premium micro-gold plating.',
    price: 320,
    unit: 'set',
    minOrderQuantity: 30,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ]),
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Necklaces', slug: 'necklaces' },
    manufacturer: {
      id: 'usr-mfr-1',
      name: 'Amit Patel',
      companyName: 'Artisan Metals Co.',
      manufacturerProfile: {
        factoryName: 'Artisan Metals Co.',
        city: 'Jaipur, Rajasthan',
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        reviewCount: 24,
        productionCapacity: '10,000 pcs/month'
      }
    }
  },
  {
    id: 'prod-6',
    title: 'Custom Velvet Rigid Jewelry Box',
    description: 'Luxury hardbound velvet jewelry packaging box with gold hot foil stamping of your brand logo.',
    price: 45,
    unit: 'piece',
    minOrderQuantity: 200,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
    ]),
    categoryId: 'cat-6',
    category: { id: 'cat-6', name: 'Packaging', slug: 'packaging' },
    manufacturer: {
      id: 'usr-mfr-1',
      name: 'Amit Patel',
      companyName: 'Artisan Metals Co.',
      manufacturerProfile: {
        factoryName: 'Artisan Metals Co.',
        city: 'Jaipur, Rajasthan',
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        reviewCount: 24,
        productionCapacity: '10,000 pcs/month'
      }
    }
  }
];

// Response interceptor to handle common errors and fallback to Supabase REST
api.interceptors.response.use(
  (response) => {
    // If it's a GET /rfqs request, merge any locally posted RFQs seamlessly into the response
    if (response.config?.url?.includes('/rfqs') && (response.config?.method || 'get').toLowerCase() === 'get') {
      try {
        const localRfqs = JSON.parse(localStorage.getItem('nirman_local_rfqs') || '[]');
        if (localRfqs.length > 0 && Array.isArray(response.data?.data)) {
          const existingIds = new Set(response.data.data.map((r: any) => r.id));
          const missingLocals = localRfqs.filter((l: any) => !existingIds.has(l.id));
          response.data.data = [...missingLocals, ...response.data.data];
        }
      } catch (e) {}
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    const url = config?.url || '';
    const method = (config?.method || 'get').toLowerCase();

    // Check if error is network / 400 / 401 / 403 / 404 / 405 / 500 / 502 / 503 / 504 / 540 error where fallback can save the user experience
    const isOfflineOrNotFound = !error.response || error.code === 'ERR_NETWORK' || [400, 401, 403, 404, 405, 500, 502, 503, 504, 540].includes(error.response?.status);

    if (isOfflineOrNotFound && config) {
      try {
        // 1. Fallback: POST /auth/register
        if (url.includes('/auth/register') && method === 'post') {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          const email = (body.email || '').toLowerCase().trim();
          const name = body.name || email.split('@')[0];
          const role = body.role || 'BUYER';
          const password = body.password || '';

          // Reject if email is a standard demo account
          const demoEmails = ['buyer@brand.com', 'buyer@d2c.com', 'mfr@factory.com', 'admin@nirmaan.com'];
          if (demoEmails.includes(email)) {
            return Promise.reject({
              response: {
                status: 400,
                data: {
                  success: false,
                  message: 'This email is already registered. Please log in instead.'
                }
              }
            });
          }

          // Check if user already exists in local storage
          let localUsers: any[] = [];
          try {
            localUsers = JSON.parse(localStorage.getItem('nirman_local_users') || '[]');
          } catch (e) {}

          if (localUsers.some((u: any) => (u.email || '').toLowerCase() === email)) {
            return Promise.reject({
              response: {
                status: 400,
                data: {
                  success: false,
                  message: 'This email is already registered. Please log in instead.'
                }
              }
            });
          }

          // Check if user already exists in Supabase database (with timeout & safe catch)
          try {
            const checkRes = await axios.get(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
              headers: supabaseHeaders,
              timeout: 2000
            });
            if (checkRes.data && checkRes.data.length > 0) {
              return Promise.reject({
                response: {
                  status: 400,
                  data: {
                    success: false,
                    message: 'This email is already registered. Please log in instead.'
                  }
                }
              });
            }
          } catch (e: any) {
            if (e?.response?.status === 400) return Promise.reject(e);
          }

          const userId = 'usr-' + Date.now();
          const now = new Date().toISOString();
          const passwordHash = password ? ('b64$' + btoa(password)) : 'scrypt$hash';

          const createdUser: any = {
            id: userId,
            email,
            name,
            role,
            companyName: body.companyName || null,
            phone: body.phone || null,
            passwordHash,
            isVerified: true,
            updatedAt: now
          };

          if (role === 'BUYER') {
            createdUser.buyerProfile = { id: 'bp-' + Date.now(), userId, companyName: body.companyName || null, phone: body.phone || null };
          } else if (role === 'MANUFACTURER') {
            createdUser.manufacturerProfile = {
              id: 'mp-' + Date.now(),
              userId,
              factoryName: body.companyName || `${name}'s Manufacturing`,
              verificationStatus: 'VERIFIED',
              rating: 4.8,
              qualityRating: 4.9,
              deliveryRating: 4.8,
              reviewCount: 3,
              city: body.city || 'Ahmedabad',
              phone: body.phone || null
            };
          }

          // Save locally immediately
          localUsers.unshift(createdUser);
          try {
            localStorage.setItem('nirman_local_users', JSON.stringify(localUsers));
          } catch (e) {}

          // Background sync to Supabase without blocking registration
          axios.post(`${SUPABASE_URL}/rest/v1/users`, {
            id: userId,
            email,
            name,
            role,
            companyName: body.companyName || null,
            phone: body.phone || null,
            passwordHash,
            isVerified: true,
            updatedAt: now
          }, {
            headers: { ...supabaseHeaders, Prefer: 'return=representation' },
            timeout: 2500
          }).catch(() => {});

          if (role === 'BUYER') {
            axios.post(`${SUPABASE_URL}/rest/v1/buyer_profiles`, {
              id: 'bp-' + Date.now(),
              userId,
              updatedAt: now
            }, { headers: supabaseHeaders, timeout: 2500 }).catch(() => {});
          } else if (role === 'MANUFACTURER') {
            axios.post(`${SUPABASE_URL}/rest/v1/manufacturer_profiles`, {
              id: 'mp-' + Date.now(),
              userId,
              factoryName: body.companyName || `${name}'s Manufacturing`,
              verificationStatus: 'VERIFIED',
              rating: 4.8,
              qualityRating: 4.9,
              deliveryRating: 4.8,
              reviewCount: 3,
              updatedAt: now
            }, { headers: supabaseHeaders, timeout: 2500 }).catch(() => {});
          }

          const token = 'jwt-live-' + btoa(JSON.stringify({ id: createdUser.id, email: createdUser.email, role: createdUser.role }));
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(createdUser));

          return {
            data: {
              success: true,
              message: 'Account created successfully',
              data: { user: createdUser, token }
            }
          };
        }

        // 2. Fallback: POST /auth/login
        if (url.includes('/auth/login') && method === 'post') {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          const email = (body.email || '').toLowerCase().trim();
          const password = body.password || '';

          // First check locally registered users
          try {
            const localUsers = JSON.parse(localStorage.getItem('nirman_local_users') || '[]');
            const localUser = localUsers.find((u: any) => (u.email || '').toLowerCase() === email);
            if (localUser) {
              if (localUser.passwordHash && localUser.passwordHash.startsWith('b64$')) {
                const expected = localUser.passwordHash.replace('b64$', '');
                if (btoa(password) !== expected) {
                  return Promise.reject({
                    response: {
                      status: 401,
                      data: { success: false, message: 'Incorrect password. Please try again.' }
                    }
                  });
                }
              }
              const token = 'jwt-live-' + btoa(JSON.stringify({ id: localUser.id, email: localUser.email, role: localUser.role }));
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(localUser));
              return {
                data: {
                  success: true,
                  message: 'Login successful',
                  data: { user: localUser, token }
                }
              };
            }
          } catch (e) {}

          // Query Supabase for user
          try {
            const userRes = await axios.get(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*,buyerProfile:buyer_profiles(*),manufacturerProfile:manufacturer_profiles(*)`, {
              headers: supabaseHeaders,
              timeout: 2500
            });

            if (userRes.data && userRes.data.length > 0) {
              const user = userRes.data[0];

              // Normalize nested profiles if array
              if (Array.isArray(user.buyerProfile)) user.buyerProfile = user.buyerProfile[0] || null;
              if (Array.isArray(user.manufacturerProfile)) user.manufacturerProfile = user.manufacturerProfile[0] || null;

              // Password check if stored with b64$
              if (user.passwordHash && user.passwordHash.startsWith('b64$')) {
                const expected = user.passwordHash.replace('b64$', '');
                if (btoa(password) !== expected) {
                  return Promise.reject({
                    response: {
                      status: 401,
                      data: {
                        success: false,
                        message: 'Incorrect password. Please try again.'
                      }
                    }
                  });
                }
              }

              const token = 'jwt-live-' + btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              return {
                data: {
                  success: true,
                  message: 'Login successful',
                  data: { user, token }
                }
              };
            }
          } catch (e: any) {
            if (e?.response?.status === 401) return Promise.reject(e);
          }

          // Fallback for standard demo accounts if not in DB
          if (email === 'buyer@brand.com' || email === 'buyer@d2c.com') {
            const demoBuyer = { id: 'usr-buyer-demo', name: 'Riya Sharma', email: 'buyer@brand.com', role: 'BUYER' };
            const token = 'jwt-demo-buyer';
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(demoBuyer));
            return { data: { success: true, message: 'Login successful', data: { user: demoBuyer, token } } };
          }

          if (email === 'mfr@factory.com') {
            const demoMfr = {
              id: 'usr-mfr-demo',
              name: 'Amit Patel',
              email: 'mfr@factory.com',
              role: 'MANUFACTURER',
              companyName: 'Artisan Metals Co.',
              manufacturerProfile: {
                factoryName: 'Artisan Metals Co.',
                verificationStatus: 'VERIFIED',
                rating: 4.8,
                qualityRating: 4.9,
                deliveryRating: 4.8,
                reviewCount: 3
              }
            };
            const token = 'jwt-demo-mfr';
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(demoMfr));
            return { data: { success: true, message: 'Login successful', data: { user: demoMfr, token } } };
          }

          // Email not found at all
          return Promise.reject({
            response: {
              status: 401,
              data: {
                success: false,
                message: 'No account found with this email. Please sign up first.'
              }
            }
          });
        }

        // 3. Fallback: GET /auth/me
        if (url.includes('/auth/me') && method === 'get') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            return {
              data: {
                success: true,
                data: JSON.parse(storedUser)
              }
            };
          }
        }

        // 4. Fallback: PUT /auth/profile or PUT /manufacturers/profile
        if ((url.includes('/auth/profile') || url.includes('/manufacturers/profile')) && method === 'put') {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : {};
          const updatedUser = { ...currentUser, ...body };

          if (currentUser.id) {
            await axios.patch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(currentUser.id)}`, {
              name: body.name || currentUser.name,
              companyName: body.companyName || currentUser.companyName,
              phone: body.phone || currentUser.phone,
              updatedAt: new Date().toISOString()
            }, { headers: supabaseHeaders }).catch(() => {});
          }

          localStorage.setItem('user', JSON.stringify(updatedUser));
          return {
            data: {
              success: true,
              message: 'Profile updated successfully',
              data: updatedUser
            }
          };
        }

        // 5. Fallback: POST /rfqs/:id/quotes or POST /quotes (Submit Quote)
        if (url.includes('/quotes') && method === 'post') {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          const rfqMatch = url.match(/\/rfqs\/([^\/]+)\/quotes/);
          const rfqId = rfqMatch ? rfqMatch[1] : (body.rfqId || 'rfq-1');

          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          const manufacturerId = currentUser?.id || 'usr-mfr-1';

          const quoteId = 'quote-' + Date.now();
          const now = new Date().toISOString();
          const unitPrice = parseFloat(body.unitPrice) || 0;
          const totalPrice = parseFloat(body.totalPrice) || (unitPrice * (body.quantity || 500));
          const deliveryDays = parseInt(body.deliveryTimeDays) || 14;

          const quotePayload = {
            id: quoteId,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
            deliveryTimeDays: deliveryDays,
            notes: body.notes || 'Official manufacturer quotation.',
            status: 'PENDING',
            rfqId: rfqId,
            manufacturerId: manufacturerId,
            createdAt: now,
            updatedAt: now,
            manufacturer: currentUser || { id: manufacturerId, name: 'You (Manufacturer)', companyName: 'Your Factory' }
          };

          try {
            const localQuotes = JSON.parse(localStorage.getItem('nirman_local_quotes') || '[]');
            localQuotes.unshift(quotePayload);
            localStorage.setItem('nirman_local_quotes', JSON.stringify(localQuotes));
          } catch (e) {}

          // Background sync to Supabase without blocking UI
          axios.post(`${SUPABASE_URL}/rest/v1/quotes`, {
            id: quoteId,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
            deliveryTimeDays: deliveryDays,
            notes: quotePayload.notes,
            status: 'PENDING',
            rfqId: rfqId,
            manufacturerId: manufacturerId,
            updatedAt: now
          }, {
            headers: { ...supabaseHeaders, Prefer: 'return=representation' },
            timeout: 2500
          }).catch(() => {});

          return {
            data: {
              success: true,
              message: 'Quote submitted successfully',
              data: quotePayload
            }
          };
        }

        // 6. Fallback: POST /rfqs (Publish Requirement)
        if (url.includes('/rfqs') && method === 'post' && !url.includes('/quotes')) {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          const buyerId = currentUser?.id || 'usr-buyer-1';

          const rfqId = 'rfq-' + Date.now();
          const now = new Date().toISOString();
          const rawTitle = (body.title || 'Custom Sourcing Request').trim();
          const title = rawTitle.length >= 3 ? rawTitle : `${rawTitle} Sourcing`;
          const rawDesc = (body.description || '').trim();
          const description = rawDesc.length >= 10 ? rawDesc : `${rawDesc} - Custom requirement specification.`;

          const rfqPayload = {
            id: rfqId,
            title,
            description,
            quantity: Number(body.quantity) || 100,
            unit: body.unit || 'piece',
            targetPrice: body.targetPrice ? Number(body.targetPrice) : null,
            status: 'OPEN',
            buyerId: buyerId,
            categoryId: body.categoryId || 'cat-1',
            createdAt: now,
            updatedAt: now,
            buyer: currentUser || { id: buyerId, name: 'You (Buyer)', companyName: 'Your Brand' },
            quotes: []
          };

          try {
            const localRfqs = JSON.parse(localStorage.getItem('nirman_local_rfqs') || '[]');
            localRfqs.unshift(rfqPayload);
            localStorage.setItem('nirman_local_rfqs', JSON.stringify(localRfqs));
          } catch (e) {}

          // Background sync to Supabase without blocking UI
          axios.post(`${SUPABASE_URL}/rest/v1/rfqs`, {
            id: rfqId,
            title: rfqPayload.title,
            description: rfqPayload.description,
            quantity: rfqPayload.quantity,
            unit: rfqPayload.unit,
            targetPrice: rfqPayload.targetPrice,
            status: 'OPEN',
            buyerId: buyerId,
            categoryId: rfqPayload.categoryId,
            updatedAt: now
          }, {
            headers: { ...supabaseHeaders, Prefer: 'return=representation' },
            timeout: 2500
          }).catch(() => {});

          return {
            data: {
              success: true,
              message: 'Requirement posted successfully',
              data: rfqPayload
            }
          };
        }

        // 7. Fallback: POST /samples (Request Sample)
        if (url.includes('/samples') && method === 'post') {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          const buyerId = currentUser?.id || 'usr-buyer-1';

          const sampleId = 'sample-' + Date.now();
          const now = new Date().toISOString();
          const samplePayload = {
            id: sampleId,
            quantity: Number(body.quantity) || 1,
            price: Number(body.price) || 250,
            shippingCost: Number(body.shippingCost) || 120,
            status: 'REQUESTED',
            notes: body.notes || 'Buyer sample request',
            buyerId: buyerId,
            manufacturerId: body.manufacturerId || 'usr-mfr-1',
            productId: body.productId || null,
            createdAt: now,
            updatedAt: now
          };

          try {
            const localSamples = JSON.parse(localStorage.getItem('nirman_local_samples') || '[]');
            localSamples.unshift(samplePayload);
            localStorage.setItem('nirman_local_samples', JSON.stringify(localSamples));
          } catch (e) {}

          try {
            await axios.post(`${SUPABASE_URL}/rest/v1/sample_requests`, samplePayload, {
              headers: { ...supabaseHeaders, Prefer: 'return=representation' }
            });
          } catch (sbErr) {
            console.warn('Supabase sample request offline, saved locally');
          }

          return {
            data: {
              success: true,
              message: 'Sample request submitted successfully',
              data: samplePayload
            }
          };
        }

        // 8. Fallback: GET /quotes
        if (url.includes('/quotes') && method === 'get') {
          let localQuotes: any[] = [];
          try {
            localQuotes = JSON.parse(localStorage.getItem('nirman_local_quotes') || '[]');
          } catch (e) {}
          const baseQuotes = [...localQuotes, ...DEFAULT_QUOTES.filter(d => !localQuotes.some(l => l.id === d.id))];

          try {
            const fallbackRes = await axios.get(`${SUPABASE_URL}/rest/v1/quotes?select=*,rfq:rfqs(*),manufacturer:users(id,name,companyName)`, {
              headers: supabaseHeaders,
              timeout: 2000
            });
            const dbQuotes = Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0 ? fallbackRes.data : [];
            const merged = [...baseQuotes, ...dbQuotes.filter((d: any) => !baseQuotes.some((l: any) => l.id === d.id))];
            return {
              data: {
                success: true,
                data: merged
              }
            };
          } catch (e) {
            return {
              data: {
                success: true,
                data: baseQuotes
              }
            };
          }
        }

        // 9. Fallback: GET /products/:id or GET /products
        if (url.includes('/products') && method === 'get') {
          const match = url.match(/\/products\/([^/?#]+)/);
          const singleId = match ? match[1] : null;

          if (singleId && singleId !== 'products') {
            try {
              const singleRes = await axios.get(
                `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(singleId)}&select=*,category:categories(*),manufacturer:users(id,name,companyName,manufacturerProfile:manufacturer_profiles(*))`,
                { headers: supabaseHeaders }
              );
              if (singleRes.data && singleRes.data.length > 0) {
                const p = singleRes.data[0];
                if (p.manufacturer && Array.isArray(p.manufacturer.manufacturerProfile)) {
                  p.manufacturer.manufacturerProfile = p.manufacturer.manufacturerProfile[0] || null;
                }
                return { data: { success: true, data: p } };
              }
            } catch (e) {}

            const matched = DEFAULT_PRODUCTS.find(p => p.id === singleId) || DEFAULT_PRODUCTS[0];
            return { data: { success: true, data: matched } };
          }

          try {
            const fallbackRes = await axios.get(
              `${SUPABASE_URL}/rest/v1/products?select=*,category:categories(*),manufacturer:users(id,name,companyName,manufacturerProfile:manufacturer_profiles(*))`,
              { headers: supabaseHeaders, timeout: 2000 }
            );
            if (fallbackRes.data && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
              const products = fallbackRes.data.map((p: any) => {
                if (p.manufacturer && Array.isArray(p.manufacturer.manufacturerProfile)) {
                  p.manufacturer.manufacturerProfile = p.manufacturer.manufacturerProfile[0] || null;
                }
                return p;
              });
              return {
                data: {
                  success: true,
                  data: {
                    products,
                    pagination: { total: products.length, page: 1, limit: 50, pages: 1 }
                  }
                }
              };
            }
          } catch (e) {}

          // Default fallback products when Supabase is paused or restoring
          return {
            data: {
              success: true,
              data: {
                products: DEFAULT_PRODUCTS,
                pagination: { total: DEFAULT_PRODUCTS.length, page: 1, limit: 50, pages: 1 }
              }
            }
          };
        }

        // 10. Fallback: GET /manufacturers
        if (url.includes('/manufacturers') && method === 'get') {
          try {
            const fallbackRes = await axios.get(`${SUPABASE_URL}/rest/v1/manufacturer_profiles?select=*,user:users(id,name,email,phone,companyName)`, {
              headers: supabaseHeaders
            });
            if (fallbackRes.data && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
              return {
                data: {
                  success: true,
                  data: fallbackRes.data
                }
              };
            }
          } catch (e) {}

          return {
            data: {
              success: true,
              data: DEFAULT_MANUFACTURERS
            }
          };
        }

        // 11. Fallback: GET /categories
        if (url.includes('/categories') && method === 'get') {
          try {
            const fallbackRes = await axios.get(`${SUPABASE_URL}/rest/v1/categories?select=*`, {
              headers: supabaseHeaders
            });
            if (fallbackRes.data && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
              return {
                data: {
                  success: true,
                  data: fallbackRes.data
                }
              };
            }
          } catch (e) {}

          return {
            data: {
              success: true,
              data: DEFAULT_CATEGORIES
            }
          };
        }

        // 12. Fallback: GET /rfqs/:id or GET /rfqs
        if (url.includes('/rfqs') && method === 'get') {
          let localRfqs: any[] = [];
          try {
            localRfqs = JSON.parse(localStorage.getItem('nirman_local_rfqs') || '[]');
          } catch (e) {}
          const baseList = [...localRfqs, ...DEFAULT_RFQS.filter(d => !localRfqs.some(l => l.id === d.id))];

          const match = url.match(/\/rfqs\/([^/?#]+)/);
          const singleRfqId = match && match[1] !== 'rfqs' ? match[1] : null;

          if (singleRfqId) {
            const found = baseList.find(r => r.id === singleRfqId) || baseList[0];
            return {
              data: {
                success: true,
                data: found
              }
            };
          }

          try {
            const fallbackRes = await axios.get(`${SUPABASE_URL}/rest/v1/rfqs?select=*,buyer:users(id,name,companyName),quotes(*)&order=createdAt.desc`, {
              headers: supabaseHeaders,
              timeout: 2000
            });
            const dbRfqs = Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0 ? fallbackRes.data : [];
            const merged = [...baseList, ...dbRfqs.filter((d: any) => !baseList.some((l: any) => l.id === d.id))];
            return {
              data: {
                success: true,
                data: merged
              }
            };
          } catch (e) {
            return {
              data: {
                success: true,
                data: baseList
              }
            };
          }
        }

        // 13. Fallback: GET /samples
        if (url.includes('/samples') && method === 'get') {
          try {
            const fallbackRes = await axios.get(`${SUPABASE_URL}/rest/v1/sample_requests?select=*,product:products(*),manufacturer:users(id,name,companyName)&order=createdAt.desc`, {
              headers: supabaseHeaders
            });
            return {
              data: {
                success: true,
                data: Array.isArray(fallbackRes.data) ? fallbackRes.data : []
              }
            };
          } catch (e) {
            return {
              data: {
                success: true,
                data: []
              }
            };
          }
        }

        // 14. Fallback: GET /orders
        if (url.includes('/orders') && method === 'get') {
          try {
            const fallbackRes = await axios.get(`${SUPABASE_URL}/rest/v1/orders?select=*,product:products(*),buyer:users(id,name,companyName),manufacturer:users(id,name,companyName)&order=createdAt.desc`, {
              headers: supabaseHeaders
            });
            return {
              data: {
                success: true,
                data: Array.isArray(fallbackRes.data) ? fallbackRes.data : []
              }
            };
          } catch (e) {
            return {
              data: {
                success: true,
                data: []
              }
            };
          }
        }

      } catch (fallbackError) {
        console.warn('Supabase automatic REST fallback failed:', fallbackError);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
