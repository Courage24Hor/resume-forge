"use client"
import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Sparkles, Loader2, ArrowUp, ArrowDown } from "lucide-react";

export function ExperienceForm() {
    const { data, addExperience, removeExperience, updateExperience, moveExperience } = useResumeStore();
    const [loadingAI, setLoadingAI] = useState<string | null>(null);

    const addNew = () => {
        addExperience({
            id: Math.random().toString(36).substr(2, 9),
            role: '',
            company: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: ''
        });
    };

    const generateAISuggestions = async (id: string, role: string, company: string) => {
        if (!role) return alert("Please enter a role first");
        setLoadingAI(id);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ role, company }),
            });
            const result = await res.json();
            updateExperience(id, { description: result.suggestions });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAI(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Experience</h2>
                <Button onClick={addNew} size="sm" className="bg-[#f97316] text-white hover:bg-[#ea580c]">
                    <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
            </div>

            {data.experience.length === 0 && (
                <div className="py-8 border-y border-dashed border-white/20 text-center">
                    <p className="text-white/60">No experience added yet.</p>
                </div>
            )}

            {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-4 border-b border-white/15 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white/80">Job Role</Label>
                            <Input 
                                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                                value={exp.role} 
                                onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                                placeholder="e.g. Sales Manager"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/80">Company</Label>
                            <Input 
                                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                                value={exp.company} 
                                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                placeholder="e.g. MTN Ghana"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white/80">Start Date</Label>
                            <Input
                                type="month"
                                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                                value={exp.startDate ?? ""}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/80">End Date</Label>
                            <Input
                                type="month"
                                className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                                value={exp.endDate ?? ""}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                disabled={!!exp.isCurrent}
                            />
                        </div>
                        <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-white/75">
                            <input
                                type="checkbox"
                                checked={!!exp.isCurrent}
                                onChange={(e) =>
                                    updateExperience(exp.id, {
                                        isCurrent: e.target.checked,
                                        endDate: e.target.checked ? "" : exp.endDate ?? "",
                                    })
                                }
                            />
                            This is my current role
                        </label>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-white/80">Description & Achievements</Label>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs bg-[#fff7ed] text-[#9a3412] border-[#fdba74] hover:bg-[#ffedd5]"
                                onClick={() => generateAISuggestions(exp.id, exp.role, exp.company)}
                                disabled={loadingAI === exp.id}
                            >
                                {loadingAI === exp.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                Optimize with AI
                            </Button>
                        </div>
                        <Textarea 
                            className="border-white/15 bg-[#111827] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                            rows={4}
                            value={exp.description} 
                            onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                            placeholder="Describe your impact..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/60 hover:text-white hover:bg-white/10 mr-1"
                            onClick={() => moveExperience(exp.id, "up")}
                        >
                            <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/60 hover:text-white hover:bg-white/10 mr-1"
                            onClick={() => moveExperience(exp.id, "down")}
                        >
                            <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-200 hover:bg-red-500/10" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="w-4 h-4 mr-1"/> Remove
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
