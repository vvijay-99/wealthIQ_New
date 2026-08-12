'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatRecordError, getProfile, saveProfile } from '@/lib/financial-data'

const options = {
  employment_type: ['Salaried', 'Self-employed', 'Business owner', 'Student', 'Retired', 'Other'],
  income_stability: ['Very stable', 'Stable', 'Variable', 'Unstable'],
  financial_goal: ['Build emergency fund', 'Reduce debt', 'Grow investments', 'Buy a home', 'Retirement', 'Other'],
  risk_tolerance: ['Conservative', 'Moderate', 'Aggressive'],
}

export default function ProfilePage() {
  const [form, setForm] = useState({ full_name: '', age: '', country: '', employment_type: '', income_stability: '', financial_goal: '', risk_tolerance: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getProfile().then((profile) => {
      if (profile) setForm({ full_name: String(profile.full_name ?? ''), age: profile.age ? String(profile.age) : '', country: String(profile.country ?? ''), employment_type: String(profile.employment_type ?? ''), income_stability: String(profile.income_stability ?? ''), financial_goal: String(profile.financial_goal ?? ''), risk_tolerance: String(profile.risk_tolerance ?? '') })
    }).catch((error) => setStatus(formatRecordError(error))).finally(() => setLoading(false))
  }, [])

  function update(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })) }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    const age = form.age ? Number(form.age) : null
    if (age !== null && (!Number.isInteger(age) || age < 13 || age > 120)) { setStatus('Enter an age between 13 and 120.'); return }
    try {
      await saveProfile({ ...form, age })
      setStatus('Profile saved securely.')
    } catch (error) { setStatus(formatRecordError(error)) }
  }

  return <DashboardLayout><PageHeader title="Financial Profile" description="Keep your financial context current for more useful planning." />
    <Card className="mt-6 max-w-3xl"><CardHeader><CardTitle className="text-base">Your profile</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="full-name">Full name</Label><Input id="full-name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="age">Age</Label><Input id="age" type="number" min="13" max="120" value={form.age} onChange={(e) => update('age', e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={form.country} onChange={(e) => update('country', e.target.value)} /></div>
      {(Object.keys(options) as Array<keyof typeof options>).map((key) => <div className="space-y-2" key={key}><Label htmlFor={key}>{key.replaceAll('_', ' ')}</Label><Select value={form[key]} onValueChange={(value) => update(key, value)}><SelectTrigger id={key}><SelectValue placeholder="Select one" /></SelectTrigger><SelectContent>{options[key].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>)}
      <div className="flex items-center gap-3 sm:col-span-2"><Button type="submit" disabled={loading}>{loading ? 'Loading…' : 'Save profile'}</Button>{status && <p className="text-sm text-muted-foreground" role="status">{status}</p>}</div>
    </form></CardContent></Card></DashboardLayout>
}
