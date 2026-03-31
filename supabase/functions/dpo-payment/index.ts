import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200, 
      headers: corsHeaders 
    })
  }

  try {
    const { amount, currency, service_description, customer_email, customer_first_name, customer_last_name, redirect_url, back_url } = await req.json()

    // DPO Configuration
    const DPO_COMPANY_TOKEN = Deno.env.get("DPO_COMPANY_TOKEN") || "your_dpo_company_token_here"
    const DPO_SERVICE_TYPE = Deno.env.get("DPO_SERVICE_TYPE") || "3854"
    const DPO_API_URL = "https://secure.3gdirectpay.com/API/v6/"
    const DPO_PAYMENT_URL = "https://secure.3gdirectpay.com/payv2.php?ID="

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16).replace(/-/g, '/')
    
    const xml_payload = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${DPO_COMPANY_TOKEN}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${amount.toFixed(2)}</PaymentAmount>
    <PaymentCurrency>${currency.toUpperCase()}</PaymentCurrency>
    <CompanyRef>Order-${crypto.randomUUID().substring(0, 8)}</CompanyRef>
    <RedirectURL>${redirect_url}</RedirectURL>
    <BackURL>${back_url}</BackURL>
    <CompanyRefContinuous>0</CompanyRefContinuous>
    <TransactionApproval>0</TransactionApproval>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${DPO_SERVICE_TYPE}</ServiceType>
      <ServiceDescription>${service_description}</ServiceDescription>
      <ServiceDate>${now}</ServiceDate>
    </Service>
  </Services>
</API3G>`

    if (DPO_COMPANY_TOKEN === "your_dpo_company_token_here") {
      // Mock Success for dev
      const mockToken = `MOCK-${crypto.randomUUID().substring(0, 8)}`
      return new Response(
        JSON.stringify({
          transToken: mockToken,
          paymentUrl: `${DPO_PAYMENT_URL}${mockToken}`,
          isMock: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch(DPO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml_payload
    })

    const text = await response.text()
    // Simplified XML parsing
    const resultMatch = text.match(/<Result>(.*?)<\/Result>/)
    const explanationMatch = text.match(/<ResultExplanation>(.*?)<\/ResultExplanation>/)
    const tokenMatch = text.match(/<TransToken>(.*?)<\/TransToken>/)

    const result = resultMatch ? resultMatch[1] : "Error"
    const explanation = explanationMatch ? explanationMatch[1] : "Unknown Error"
    const transToken = tokenMatch ? tokenMatch[1] : ""

    if (result === "000") {
      return new Response(
        JSON.stringify({
          transToken,
          paymentUrl: `${DPO_PAYMENT_URL}${transToken}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`DPO Error: ${explanation} (${result})`)
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
