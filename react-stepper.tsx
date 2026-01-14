"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StepStatus = "completed" | "current" | "upcoming"

type Step = {
  id: string
  title: string
  description?: string
  status: StepStatus
}

function StepDot({ status }: { status: StepStatus }) {
  if (status === "current") {
    // Matches the screenshot vibe: dark outer ring + light ring + dark center dot
    return (
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-foreground" />
        <div className="absolute inset-[3px] rounded-full bg-background" />
        <div className="absolute inset-[8px] rounded-full bg-foreground" />
      </div>
    )
  }

  if (status === "completed") {
    return (
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-foreground" />
        <div className="absolute inset-[3px] rounded-full bg-background" />
        <div className="absolute inset-[9px] rounded-full bg-foreground" />
      </div>
    )
  }

  // upcoming
  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      <div className="absolute inset-0 rounded-full border bg-background" />
      <div className="absolute inset-[12px] rounded-full bg-muted-foreground" />
    </div>
  )
}

export default function VerticalStepperPreview() {
  const steps: Step[] = [
    {
      id: "1",
      title: "Your details",
      description:
        "Provide your name and email address. We will use this information to create your account",
      status: "current",
    },
    {
      id: "2",
      title: "Company details",
      description: "A few details about your company will help us personalize your experience",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Invite your team",
      description:
        "Start collaborating with your team by inviting them to join your account. You can skip this step and invite them later",
      status: "upcoming",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-4 text-sm font-medium">Vertical</div>

      <Card className="max-w-4xl">
        <CardHeader className="py-6">
          <CardTitle className="text-base"> </CardTitle>
        </CardHeader>
        <CardContent className="pb-10">
          <div className="relative">
            {/* connector line */}
            <div className="pointer-events-none absolute left-5 top-6 h-[calc(100%-24px)] w-px bg-border" />

            <ul className="space-y-10">
              {steps.map((step) => (
                <li key={step.id} className="grid grid-cols-[64px_1fr] items-start gap-4">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <StepDot status={step.status} />
                  </div>

                  <div className="space-y-2">
                    <div className="text-base font-semibold">{step.title}</div>
                    {step.description ? (
                      <p
                        className={cn(
                          "max-w-[520px] text-sm leading-relaxed text-muted-foreground",
                          step.status === "current" && "text-muted-foreground"
                        )}
                      >
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
