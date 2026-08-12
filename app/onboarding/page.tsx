'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardLayout } from '@/components/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { Brain, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const steps = ['Profile', 'Income', 'Expenses', 'Savings', 'Goals'];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/register');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Welcome to WealthIQ"
        description="Let's set up your financial profile to get started."
      />

      {/* Progress */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                idx < currentStep
                  ? 'bg-success text-success-foreground'
                  : idx === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step}
            </span>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-px bg-border" />
            )}
          </div>
        ))}
      </div>

      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="28" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="India">
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment">Employment Type</Label>
                <Select defaultValue="full-time">
                  <SelectTrigger id="employment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="monthly_income">Monthly Income (₹)</Label>
                <Input id="monthly_income" type="number" placeholder="85000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_income">Other Monthly Income (₹)</Label>
                <Input id="other_income" type="number" placeholder="5000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income_stability">Income Stability</Label>
                <Select defaultValue="stable">
                  <SelectTrigger id="income_stability">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable">Stable (same every month)</SelectItem>
                    <SelectItem value="variable">Variable (fluctuates)</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="freelance">Freelance / Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="housing">Housing (₹/month)</Label>
                  <Input id="housing" type="number" placeholder="18000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="food">Food (₹/month)</Label>
                  <Input id="food" type="number" placeholder="12000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transport">Transportation (₹/month)</Label>
                  <Input id="transport" type="number" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilities">Utilities (₹/month)</Label>
                  <Input id="utilities" type="number" placeholder="3000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthcare">Healthcare (₹/month)</Label>
                  <Input id="healthcare" type="number" placeholder="2000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entertainment">Entertainment (₹/month)</Label>
                  <Input id="entertainment" type="number" placeholder="6000" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You can add more expense categories later from the Expenses page.
              </p>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="current_savings">Current Total Savings (₹)</Label>
                <Input id="current_savings" type="number" placeholder="120000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_fund">Emergency Fund (₹)</Label>
                <Input id="emergency_fund" type="number" placeholder="95000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_savings">Monthly Savings (₹)</Label>
                <Input id="monthly_savings" type="number" placeholder="33000" />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Financial Goal</Label>
                <Select defaultValue="emergency-fund">
                  <SelectTrigger id="goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency-fund">Build emergency fund</SelectItem>
                    <SelectItem value="debt-free">Become debt-free</SelectItem>
                    <SelectItem value="invest">Start investing</SelectItem>
                    <SelectItem value="house">Save for a house</SelectItem>
                    <SelectItem value="retirement">Plan for retirement</SelectItem>
                    <SelectItem value="education">Save for education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Tolerance</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger id="risk">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative — Low risk</SelectItem>
                    <SelectItem value="moderate">Moderate — Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive — High risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">
                    You can update all of this information later.
                  </p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  WealthIQ will use this data to calculate your Financial Health
                  Score and generate personalized insights.
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? 'Back' : 'Previous'}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
