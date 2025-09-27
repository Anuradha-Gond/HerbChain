// API utility functions for HerbChain backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Types based on your backend models
export interface User {
  _id: string
  name: string
  email: string
  role: "farmer" | "manufacturer" | "distributor" | "regulator" | "consumer"
  createdAt: string
}

export interface Batch {
  _id: string
  batchId: string
  farmer: string | User
  herbType: string
  quantityKg: number
  photoUrl?: string
  gps?: { lat: number; lng: number }
  collectedAt: string
  cultivationDate?: string
  status: "created" | "received" | "tested" | "processed" | "packaged" | "exported" | "certified" | "rejected"
  qrPayload?: string
  blockchainTx?: string
  shipmentDetails?: string
  transportLogs: Array<{ gps: { lat: number; lng: number; note: string }; time: string }>
  labReports: string[]
  qualityScore?: string
  createdAt: string
  updatedAt: string
}

export interface Shipment {
  _id: string
  shipmentId: string
  batchId: string
  destination: string
  transportMode: string
  estimatedDelivery?: string
  status:
    | "received"
    | "in-storage"
    | "quality-check"
    | "packaging"
    | "ready-to-ship"
    | "in-transit"
    | "delivered"
    | "completed"
  storageConditions?: string
  currentLocation?: string
  temperature?: string
  humidity?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  token?: string
}

// Auth token management
let authToken: string | null = null

export const setAuthToken = (token: string) => {
  authToken = token
  if (typeof window !== "undefined") {
    localStorage.setItem("herbchain_token", token)
  }
}

export const getAuthToken = (): string | null => {
  if (authToken) return authToken
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("herbchain_token")
  }
  return authToken
}

export const clearAuthToken = () => {
  authToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("herbchain_token")
  }
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return { success: true, ...data }
  } catch (error) {
    console.error("API Error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Auth API functions
export const authAPI = {
  register: async (userData: {
    name: string
    email: string
    password: string
    role: string
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest("/auth", {
      method: "POST",
      body: JSON.stringify({ action: "register", ...userData }),
    })
  },

  login: async (credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest("/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login", ...credentials }),
    })
  },
}

// Farmer API functions
export const farmerAPI = {
  addBatch: async (batchData: {
    herbType: string
    quantityKg: number
    photoUrl?: string
    gps?: { lat: number; lng: number }
  }): Promise<ApiResponse<Batch>> => {
    return apiRequest("/farmer/add-batch", {
      method: "POST",
      body: JSON.stringify(batchData),
    })
  },

  getMyBatches: async (): Promise<ApiResponse<Batch[]>> => {
    return apiRequest("/farmer/history")
  },

  getBatch: async (id: string): Promise<ApiResponse<Batch>> => {
    return apiRequest(`/farmer/batch/${id}`)
  },
}

// Manufacturer API functions
export const manufacturerAPI = {
  receiveBatch: async (batchData: {
    batchId: string
    notes?: string
  }): Promise<ApiResponse<Batch>> => {
    return apiRequest("/manufacturer/receive", {
      method: "POST",
      body: JSON.stringify(batchData),
    })
  },

  uploadLabReport: async (formData: FormData): Promise<ApiResponse<any>> => {
    const token = getAuthToken()

    try {
      const response = await fetch(`${API_BASE_URL}/manufacturer/upload-lab`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Upload failed")
      }

      return { success: true, ...data }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      }
    }
  },

  updateProcessing: async (processData: {
    batchId: string
    status: string
    notes?: string
  }): Promise<ApiResponse<Batch>> => {
    return apiRequest("/manufacturer/process", {
      method: "POST",
      body: JSON.stringify(processData),
    })
  },
}

// Distributor API functions
export const distributorAPI = {
  getShipments: async (): Promise<ApiResponse<Shipment[]>> => {
    return apiRequest("/distributor/shipments")
  },

  getAvailableBatches: async (): Promise<ApiResponse<Batch[]>> => {
    return apiRequest("/distributor/available-batches")
  },

  receiveBatch: async (batchData: {
    batchId: string
    storageLocation?: string
    notes?: string
  }): Promise<ApiResponse<Batch>> => {
    return apiRequest("/distributor/receive-batch", {
      method: "POST",
      body: JSON.stringify(batchData),
    })
  },

  createShipment: async (shipmentData: {
    batchId: string
    destination: string
    transportMode: string
    estimatedDelivery?: string
    storageConditions?: string
    notes?: string
  }): Promise<ApiResponse<Shipment>> => {
    return apiRequest("/distributor/create-shipment", {
      method: "POST",
      body: JSON.stringify(shipmentData),
    })
  },

  updateShipmentTracking: async (trackingData: {
    shipmentId: string
    status: string
    location?: string
    temperature?: string
    humidity?: string
    notes?: string
  }): Promise<ApiResponse<Shipment>> => {
    return apiRequest("/distributor/update-tracking", {
      method: "POST",
      body: JSON.stringify(trackingData),
    })
  },

  packageBatch: async (formData: FormData): Promise<ApiResponse<any>> => {
    const token = getAuthToken()

    try {
      const response = await fetch(`${API_BASE_URL}/distributor/package`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Package failed")
      }

      return { success: true, ...data }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Package failed",
      }
    }
  },

  logTransport: async (transportData: {
    batchId: string
    gps: { lat: number; lng: number; note: string }
  }): Promise<ApiResponse<any>> => {
    return apiRequest("/distributor/transport", {
      method: "POST",
      body: JSON.stringify(transportData),
    })
  },

  markDelivered: async (deliveryData: {
    batchId: string
    notes?: string
  }): Promise<ApiResponse<any>> => {
    return apiRequest("/distributor/deliver", {
      method: "POST",
      body: JSON.stringify(deliveryData),
    })
  },
}

// Regulator API functions
export const regulatorAPI = {
  verifyBatch: async (verificationData: {
    batchId: string
    verified: boolean
    notes?: string
  }): Promise<ApiResponse<any>> => {
    return apiRequest("/regulator/verify", {
      method: "POST",
      body: JSON.stringify(verificationData),
    })
  },

  certifyBatch: async (certificationData: {
    batchId: string
    certified: boolean
    notes?: string
  }): Promise<ApiResponse<any>> => {
    return apiRequest("/regulator/certify", {
      method: "POST",
      body: JSON.stringify(certificationData),
    })
  },

  getAnalytics: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/regulator/analytics")
  },
}

// Consumer API functions
export const consumerAPI = {
  scanBatch: async (batchId: string): Promise<ApiResponse<Batch>> => {
    return apiRequest(`/consumer/scan/${batchId}`)
  },
}

// Unified API object export to match import patterns
export const api = {
  auth: authAPI,
  farmer: farmerAPI,
  manufacturer: manufacturerAPI,
  distributor: distributorAPI,
  regulator: regulatorAPI,
  consumer: consumerAPI,
}
