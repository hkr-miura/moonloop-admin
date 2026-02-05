"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { syncFormOptionsAction } from "@/app/actions/sync";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; dates?: string[] } | null>(null);

    const handleSync = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await syncFormOptionsAction();
            if (res.success) {
                setResult({
                    success: true,
                    message: "Form successfully updated!",
                    dates: res.syncedDates
                });
            } else {
                setResult({ success: false, message: res.error || "Unknown error" });
            }
        } catch (error) {
            setResult({ success: false, message: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage system configurations and automation.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle>Form Synchronization</CardTitle>
                        <CardDescription>
                            Automatically update the "Normal Reservation Form" date choices.
                            This will generate upcoming Mondays (next 8 weeks) and remove any dates that conflict with scheduled Events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground bg-white/5 p-4 rounded-md">
                            <p className="font-semibold mb-2">Logic:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Target: "ご希望の日にち" dropdown in Normal Form</li>
                                <li>Source: Next 8 Mondays from today</li>
                                <li>Exclusion: Any date found in "Events" list</li>
                            </ul>
                        </div>

                        {result && (
                            <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "border-green-500/50 bg-green-500/10 text-green-200" : ""}>
                                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                                <AlertDescription>
                                    {result.message}
                                    {result.success && result.dates && (
                                        <div className="mt-2 text-xs font-mono opacity-80 break-words">
                                            Dates: {result.dates.join(", ")}
                                        </div>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSync} disabled={loading} className="w-full sm:w-auto">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!loading && <RefreshCw className="mr-2 h-4 w-4" />}
                            Run Sync Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
