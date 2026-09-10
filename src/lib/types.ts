export type AdminUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone?: string | null;
  role: "CLIENT" | "PROVIDER" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
  createdAt: string;
  providerProfile?: {
    avatarUrl?: string | null;
    dateOfBirth?: string | null;
    profession?: string | null;
    homeAddress?: string | null;
    homeCommune?: string | null;
    homeCity?: string | null;
    propertyCount?: number | null;
    propertyTypes?: string[];
    idDocumentType?: string | null;
    idDocumentUrl?: string | null;
    kycStatus?: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED" | null;
    kycRejectionReason?: string | null;
    mobileMoneyNumber?: string | null;
    bankAccount?: string | null;
    acceptedPaymentMethods?: string[];
    onboardingCompletedAt?: string | null;
  } | null;
  _count?: { properties: number; bookings: number };
};

export type DashboardStats = {
  propertiesPublished: number;
  propertiesPending: number;
  users: number;
  bookings: number;
  paymentsSucceeded: number;
  revenue: number;
  commission: number;
};

export type PropertyRow = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  rooms?: number;
  capacity?: number;
  commune: string;
  neighborhood?: string | null;
  address?: string;
  gpsLat?: number | null;
  gpsLng?: number | null;
  pricePerNight: number | string;
  status: "PENDING_REVIEW" | "PUBLISHED" | "SUSPENDED" | "ARCHIVED";
  amenities?: string[];
  accessTags?: string[];
  conditions?: string | null;
  photos: string[];
  createdAt: string;
  owner?: {
    id: string;
    fullName: string;
    email: string | null;
    phone?: string | null;
    whatsappNumber?: string | null;
  };
};

export type BookingRow = {
  id: string;
  reference?: string;
  status: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number | string;
  commissionAmount: number | string;
  createdAt: string;
  property?: { name: string; commune?: string };
  client?: { fullName: string; phone?: string | null };
  payment?: { status: string; paidAmount: number | string } | null;
};

export type PaymentRow = {
  id: string;
  status: string;
  paidAmount: number | string;
  fees?: number | string | null;
  method?: string | null;
  payoutStatus?: string | null;
  payoutAmount?: number | string | null;
  createdAt: string;
  booking?: {
    id: string;
    status: string;
    commissionAmount?: number | string;
    providerAmount?: number | string;
  } | null;
};
