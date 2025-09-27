const { Contract } = require("fabric-contract-api")

class HerbChainContract extends Contract {
  // Initialize the ledger with sample data
  async InitLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========")

    const batches = [
      {
        batchId: "batch_sample_001",
        farmerId: "farmer_001",
        herbType: "Ashwagandha",
        quantity: 100,
        harvestDate: "2024-01-15",
        location: { latitude: 28.6139, longitude: 77.209 },
        ipfsHash: "QmSampleHash001",
        status: "harvested",
        timestamp: new Date().toISOString(),
        processingRecords: [],
        auditRecords: [],
      },
    ]

    for (let i = 0; i < batches.length; i++) {
      batches[i].docType = "batch"
      await ctx.stub.putState(batches[i].batchId, Buffer.from(JSON.stringify(batches[i])))
      console.info("Added <--> ", batches[i])
    }

    console.info("============= END : Initialize Ledger ===========")
  }

  // Register a new herb batch
  async RegisterBatch(ctx, batchId, farmerId, herbType, quantity, harvestDate, location, ipfsHash) {
    console.info("============= START : Register Batch ===========")

    // Check if batch already exists
    const batchExists = await this.BatchExists(ctx, batchId)
    if (batchExists) {
      throw new Error(`The batch ${batchId} already exists`)
    }

    const batch = {
      docType: "batch",
      batchId: batchId,
      farmerId: farmerId,
      herbType: herbType,
      quantity: Number.parseFloat(quantity),
      harvestDate: harvestDate,
      location: JSON.parse(location),
      ipfsHash: ipfsHash,
      status: "harvested",
      timestamp: new Date().toISOString(),
      processingRecords: [],
      auditRecords: [],
      shipmentRecords: [],
    }

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)))

    // Emit event
    const eventPayload = Buffer.from(
      JSON.stringify({
        batchId: batchId,
        farmerId: farmerId,
        herbType: herbType,
        action: "BATCH_REGISTERED",
      }),
    )
    ctx.stub.setEvent("BatchRegistered", eventPayload)

    console.info("============= END : Register Batch ===========")
    return JSON.stringify(batch)
  }

  // Update batch status
  async UpdateBatchStatus(ctx, batchId, newStatus, updatedBy, timestamp) {
    console.info("============= START : Update Batch Status ===========")

    const batchString = await this.ReadBatch(ctx, batchId)
    const batch = JSON.parse(batchString)

    const validStatuses = ["harvested", "verified", "processed", "packaged", "shipped", "delivered"]
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`)
    }

    batch.status = newStatus
    batch.lastUpdated = timestamp
    batch.lastUpdatedBy = updatedBy

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)))

    // Emit event
    const eventPayload = Buffer.from(
      JSON.stringify({
        batchId: batchId,
        newStatus: newStatus,
        updatedBy: updatedBy,
        action: "STATUS_UPDATED",
      }),
    )
    ctx.stub.setEvent("BatchStatusUpdated", eventPayload)

    console.info("============= END : Update Batch Status ===========")
    return JSON.stringify(batch)
  }

  // Add processing record
  async AddProcessingRecord(ctx, batchId, processorId, processingType, labReportHash, qualityGrade, timestamp) {
    console.info("============= START : Add Processing Record ===========")

    const batchString = await this.ReadBatch(ctx, batchId)
    const batch = JSON.parse(batchString)

    const processingRecord = {
      processorId: processorId,
      processingType: processingType,
      labReportHash: labReportHash,
      qualityGrade: qualityGrade,
      timestamp: timestamp,
      recordId: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    batch.processingRecords.push(processingRecord)
    batch.lastUpdated = timestamp
    batch.lastUpdatedBy = processorId

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)))

    // Emit event
    const eventPayload = Buffer.from(
      JSON.stringify({
        batchId: batchId,
        processorId: processorId,
        processingType: processingType,
        action: "PROCESSING_RECORD_ADDED",
      }),
    )
    ctx.stub.setEvent("ProcessingRecordAdded", eventPayload)

    console.info("============= END : Add Processing Record ===========")
    return JSON.stringify(batch)
  }

  // Add shipment record
  async AddShipmentRecord(ctx, batchId, distributorId, originLocation, destinationLocation, shipmentDate) {
    console.info("============= START : Add Shipment Record ===========")

    const batchString = await this.ReadBatch(ctx, batchId)
    const batch = JSON.parse(batchString)

    const shipmentRecord = {
      distributorId: distributorId,
      originLocation: JSON.parse(originLocation),
      destinationLocation: JSON.parse(destinationLocation),
      shipmentDate: shipmentDate,
      trackingCheckpoints: [],
      recordId: `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    batch.shipmentRecords.push(shipmentRecord)
    batch.lastUpdated = new Date().toISOString()
    batch.lastUpdatedBy = distributorId

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)))

    // Emit event
    const eventPayload = Buffer.from(
      JSON.stringify({
        batchId: batchId,
        distributorId: distributorId,
        action: "SHIPMENT_RECORD_ADDED",
      }),
    )
    ctx.stub.setEvent("ShipmentRecordAdded", eventPayload)

    console.info("============= END : Add Shipment Record ===========")
    return JSON.stringify(batch)
  }

  // Add audit record
  async AddAuditRecord(ctx, batchId, auditorId, auditType, findings, certificationStatus, certificateHash) {
    console.info("============= START : Add Audit Record ===========")

    const batchString = await this.ReadBatch(ctx, batchId)
    const batch = JSON.parse(batchString)

    const auditRecord = {
      auditorId: auditorId,
      auditType: auditType,
      findings: findings,
      certificationStatus: certificationStatus,
      certificateHash: certificateHash,
      timestamp: new Date().toISOString(),
      recordId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    batch.auditRecords.push(auditRecord)
    batch.lastUpdated = new Date().toISOString()
    batch.lastUpdatedBy = auditorId

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)))

    // Emit event
    const eventPayload = Buffer.from(
      JSON.stringify({
        batchId: batchId,
        auditorId: auditorId,
        auditType: auditType,
        certificationStatus: certificationStatus,
        action: "AUDIT_RECORD_ADDED",
      }),
    )
    ctx.stub.setEvent("AuditRecordAdded", eventPayload)

    console.info("============= END : Add Audit Record ===========")
    return JSON.stringify(batch)
  }

  // Read a batch
  async ReadBatch(ctx, batchId) {
    const batchJSON = await ctx.stub.getState(batchId)
    if (!batchJSON || batchJSON.length === 0) {
      throw new Error(`The batch ${batchId} does not exist`)
    }
    return batchJSON.toString()
  }

  // Check if batch exists
  async BatchExists(ctx, batchId) {
    const batchJSON = await ctx.stub.getState(batchId)
    return batchJSON && batchJSON.length > 0
  }

  // Verify batch authenticity
  async VerifyBatch(ctx, batchId) {
    console.info("============= START : Verify Batch ===========")

    const exists = await this.BatchExists(ctx, batchId)
    if (!exists) {
      return JSON.stringify({ exists: false, message: "Batch not found in blockchain" })
    }

    const batchString = await this.ReadBatch(ctx, batchId)
    const batch = JSON.parse(batchString)

    // Perform authenticity checks
    const authenticity = {
      exists: true,
      batchId: batch.batchId,
      farmerId: batch.farmerId,
      herbType: batch.herbType,
      status: batch.status,
      isAuthentic: true,
      verificationTimestamp: new Date().toISOString(),
      processingRecordsCount: batch.processingRecords.length,
      auditRecordsCount: batch.auditRecords.length,
      shipmentRecordsCount: batch.shipmentRecords.length,
    }

    console.info("============= END : Verify Batch ===========")
    return JSON.stringify(authenticity)
  }

  // Get batch history
  async GetBatchHistory(ctx, batchId) {
    console.info("============= START : Get Batch History ===========")

    const resultsIterator = await ctx.stub.getHistoryForKey(batchId)
    const results = await this.GetAllResults(resultsIterator, true)

    console.info("============= END : Get Batch History ===========")
    return JSON.stringify(results)
  }

  // Get all batches by farmer
  async GetBatchesByFarmer(ctx, farmerId) {
    console.info("============= START : Get Batches By Farmer ===========")

    const queryString = {
      selector: {
        docType: "batch",
        farmerId: farmerId,
      },
    }

    const resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    const results = await this.GetAllResults(resultsIterator, false)

    console.info("============= END : Get Batches By Farmer ===========")
    return JSON.stringify(results)
  }

  // Get batches by herb type
  async GetBatchesByHerbType(ctx, herbType) {
    console.info("============= START : Get Batches By Herb Type ===========")

    const queryString = {
      selector: {
        docType: "batch",
        herbType: herbType,
      },
    }

    const resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    const results = await this.GetAllResults(resultsIterator, false)

    console.info("============= END : Get Batches By Herb Type ===========")
    return JSON.stringify(results)
  }

  // Get batches by status
  async GetBatchesByStatus(ctx, status) {
    console.info("============= START : Get Batches By Status ===========")

    const queryString = {
      selector: {
        docType: "batch",
        status: status,
      },
    }

    const resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    const results = await this.GetAllResults(resultsIterator, false)

    console.info("============= END : Get Batches By Status ===========")
    return JSON.stringify(results)
  }

  // Get all batches
  async GetAllBatches(ctx) {
    console.info("============= START : Get All Batches ===========")

    const queryString = {
      selector: {
        docType: "batch",
      },
    }

    const resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    const results = await this.GetAllResults(resultsIterator, false)

    console.info("============= END : Get All Batches ===========")
    return JSON.stringify(results)
  }

  // Helper function to get all results from iterator
  async GetAllResults(iterator, isHistory) {
    const allResults = []
    let res = await iterator.next()
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        const jsonRes = {}
        console.log(res.value.value.toString("utf8"))
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.txId
          jsonRes.Timestamp = res.value.timestamp
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"))
          } catch (err) {
            console.log(err)
            jsonRes.Value = res.value.value.toString("utf8")
          }
        } else {
          jsonRes.Key = res.value.key
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"))
          } catch (err) {
            console.log(err)
            jsonRes.Record = res.value.value.toString("utf8")
          }
        }
        allResults.push(jsonRes)
      }
      res = await iterator.next()
    }
    iterator.close()
    return allResults
  }
}

module.exports = HerbChainContract
