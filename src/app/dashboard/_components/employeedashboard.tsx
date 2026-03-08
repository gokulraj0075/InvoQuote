"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Client = {
 id: string
 name: string
 userId: string
}

type Quotation = {
 id: string
 quotationNumber: string
 userId: string
}

type Invoice = {
 id: string
 invoiceNumber: string
 userId: string
}

export default function EmployeeDashboard({ userId }: { userId: string }) {

 const [clients,setClients] = useState<Client[]>([])
 const [quotations,setQuotations] = useState<Quotation[]>([])
 const [invoices,setInvoices] = useState<Invoice[]>([])
 const [recent,setRecent] = useState<string[]>([])

 const loadData = useCallback(async () => {

  try{

   const [clientsRes,quotationsRes,invoicesRes] = await Promise.all([
    fetch("/api/clients"),
    fetch("/api/quotations"),
    fetch("/api/invoices")
   ])

   const clientsData = await clientsRes.json()
   const quotationsData = await quotationsRes.json()
   const invoicesData = await invoicesRes.json()

   const safeClients = Array.isArray(clientsData) ? clientsData : []
   const safeQuotations = Array.isArray(quotationsData) ? quotationsData : []
   const safeInvoices = Array.isArray(invoicesData) ? invoicesData : []

   setClients(safeClients)
   setQuotations(safeQuotations)
   setInvoices(safeInvoices)

   const activity:string[] = []

   safeQuotations
   .filter((q:Quotation)=>q.userId===userId)
   .slice(-5)
   .forEach((q:Quotation)=>{
    activity.push(`Quotation ${q.quotationNumber} created`)
   })

   safeInvoices
   .filter((i:Invoice)=>i.userId===userId)
   .slice(-5)
   .forEach((i:Invoice)=>{
    activity.push(`Invoice ${i.invoiceNumber} generated`)
   })

   setRecent(activity.reverse())

  }
  catch(error){
   console.error("Dashboard load failed",error)
   setClients([])
   setQuotations([])
   setInvoices([])
  }

 },[userId])

 useEffect(()=>{
  loadData()
 },[loadData])

 const myClients = clients.filter(c=>c.userId===userId).length
 const myQuotations = quotations.filter(q=>q.userId===userId).length
 const myInvoices = invoices.filter(i=>i.userId===userId).length

 return(

  <div className="grid gap-4 md:grid-cols-3">

   <Card>
    <CardHeader>
     <CardTitle>My Clients</CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-2xl font-bold">{myClients}</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader>
     <CardTitle>Quotations Created</CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-2xl font-bold">{myQuotations}</p>
    </CardContent>
   </Card>

   <Card>
    <CardHeader>
     <CardTitle>Invoices Generated</CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-2xl font-bold">{myInvoices}</p>
    </CardContent>
   </Card>

   <Card className="col-span-3">
    <CardHeader>
     <CardTitle>Recent Activity</CardTitle>
    </CardHeader>

    <CardContent className="space-y-2">

     {recent.length===0 && (
      <p className="text-sm text-muted-foreground">
       No recent activity
      </p>
     )}

     {recent.map((r)=>(
      <p key={r} className="text-sm">
       {r}
      </p>
     ))}

    </CardContent>

   </Card>

  </div>

 )

}
