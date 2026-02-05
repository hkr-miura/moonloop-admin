import { getOpinions } from "@/lib/google/sheets";
import { Card } from "@/components/ui/card";
import { MessageSquare, Calendar } from "lucide-react";

export const revalidate = 60;

export default async function OpinionsPage() {
    const opinions = await getOpinions();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Opinion Box</h1>
                <p className="text-muted-foreground mt-1">Customer feedback and suggestions.</p>
            </div>

            <div className="grid gap-4">
                {opinions.length > 0 ? (
                    opinions.map((op) => (
                        <Card key={op.rowId} className="bg-card/50 backdrop-blur-sm border-white/10 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{op.timestamp}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${op.status === 'Unread' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                    {op.status}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <p className="text-foreground/90 whitespace-pre-wrap">{op.content}</p>
                                    {op.attributes && (
                                        <div className="text-xs text-muted-foreground bg-white/5 inline-block px-2 py-1 rounded">
                                            {op.attributes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-lg border border-white/5">
                        <p>No feedback received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
