-- HerbChain Database Schema
-- Run this script to create all necessary tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'manufacturer', 'distributor', 'regulator')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    aadhaar_id VARCHAR(12),
    license_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
    id VARCHAR(255) PRIMARY KEY,
    farmer_id VARCHAR(255) REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    location JSONB NOT NULL,
    area_hectares DECIMAL(10,2),
    soil_type VARCHAR(100),
    organic_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Herb batches table
CREATE TABLE IF NOT EXISTS herb_batches (
    id VARCHAR(255) PRIMARY KEY,
    farmer_id VARCHAR(255) REFERENCES users(id),
    farm_id VARCHAR(255) REFERENCES farms(id),
    herb_type VARCHAR(255) NOT NULL,
    sanskrit_name VARCHAR(255),
    quantity_kg DECIMAL(10,2) NOT NULL,
    harvest_date DATE NOT NULL,
    cultivation_method VARCHAR(50) CHECK (cultivation_method IN ('organic', 'conventional')),
    location JSONB NOT NULL,
    photos JSONB,
    blockchain_hash VARCHAR(255),
    qr_code VARCHAR(255),
    status VARCHAR(50) DEFAULT 'harvested' CHECK (status IN ('harvested', 'verified', 'processed', 'packaged', 'shipped', 'delivered')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Processing records table
CREATE TABLE IF NOT EXISTS processing_records (
    id VARCHAR(255) PRIMARY KEY,
    batch_id VARCHAR(255) REFERENCES herb_batches(id),
    processor_id VARCHAR(255) REFERENCES users(id),
    processing_type VARCHAR(50) CHECK (processing_type IN ('drying', 'grinding', 'extraction', 'formulation')),
    processing_date DATE NOT NULL,
    lab_report_ipfs VARCHAR(255),
    quality_grade VARCHAR(1) CHECK (quality_grade IN ('A', 'B', 'C')),
    moisture_content DECIMAL(5,2),
    purity_percentage DECIMAL(5,2),
    pesticide_free BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment records table
CREATE TABLE IF NOT EXISTS shipment_records (
    id VARCHAR(255) PRIMARY KEY,
    batch_id VARCHAR(255) REFERENCES herb_batches(id),
    distributor_id VARCHAR(255) REFERENCES users(id),
    origin_location JSONB NOT NULL,
    destination_location JSONB NOT NULL,
    shipment_date DATE NOT NULL,
    expected_delivery DATE,
    actual_delivery DATE,
    transport_conditions JSONB,
    tracking_checkpoints JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit records table
CREATE TABLE IF NOT EXISTS audit_records (
    id VARCHAR(255) PRIMARY KEY,
    batch_id VARCHAR(255) REFERENCES herb_batches(id),
    auditor_id VARCHAR(255) REFERENCES users(id),
    audit_type VARCHAR(50) CHECK (audit_type IN ('quality', 'compliance', 'authenticity')),
    audit_date DATE NOT NULL,
    findings TEXT,
    certification_status VARCHAR(50) DEFAULT 'pending' CHECK (certification_status IN ('approved', 'rejected', 'pending')),
    certificate_ipfs VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_herb_batches_farmer_id ON herb_batches(farmer_id);
CREATE INDEX IF NOT EXISTS idx_herb_batches_status ON herb_batches(status);
CREATE INDEX IF NOT EXISTS idx_processing_records_batch_id ON processing_records(batch_id);
CREATE INDEX IF NOT EXISTS idx_shipment_records_batch_id ON shipment_records(batch_id);
CREATE INDEX IF NOT EXISTS idx_audit_records_batch_id ON audit_records(batch_id);
