'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createNewEventAction } from '@/app/actions/events';
import { Loader2, Plus } from 'lucide-react';

export function CreateEventModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '19:00'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await createNewEventAction(formData);
            if (result.success) {
                setOpen(false);
                setFormData({ title: '', date: '', time: '19:00' }); // Reset
            } else {
                alert('Failed: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-white/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-white">Event Title</Label>
                        <Input
                            id="title"
                            className="bg-white/5 border-white/10 text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g. Moon Jazz Night"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date" className="text-white">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                className="bg-white/5 border-white/10 text-white"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time" className="text-white">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                className="bg-white/5 border-white/10 text-white"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Event
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
