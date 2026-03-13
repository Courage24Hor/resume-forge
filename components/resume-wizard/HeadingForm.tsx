"use client"
import { useResumeStore } from "@/hooks/use-resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HeadingForm() {
    const { data, updateHeading, updateSummary } = useResumeStore();
    const heading = {
        firstName: data?.heading?.firstName ?? "",
        lastName: data?.heading?.lastName ?? "",
        city: data?.heading?.city ?? "",
        country: data?.heading?.country ?? "",
        postcode: data?.heading?.postcode ?? "",
        phone: data?.heading?.phone ?? "",
        email: data?.heading?.email ?? "",
    };
    const summary = data?.summary ?? "";

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <p className="text-sm font-semibold text-white">What&apos;s the best way for employers to contact you?</p>
                <p className="mt-1 text-sm text-white/70">We suggest including an email and phone number.</p>
                <p className="mt-2 text-xs text-white/50">* indicates a required field</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                        <Label className="text-white/80">Name</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={heading.firstName} 
                        onChange={(e) => updateHeading({ firstName: e.target.value })} 
                        placeholder="Akua"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-white/80">Surname</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={heading.lastName} 
                        onChange={(e) => updateHeading({ lastName: e.target.value })} 
                        placeholder="Mensah"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-white/80">City</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={heading.city} 
                        onChange={(e) => updateHeading({ city: e.target.value })} 
                        placeholder="Kumasi"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-white/80">Country</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={heading.country} 
                        onChange={(e) => updateHeading({ country: e.target.value })} 
                        placeholder="Ghana"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-white/80">Postcode</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={heading.postcode} 
                        onChange={(e) => updateHeading({ postcode: e.target.value })} 
                        placeholder="AK-039-5021"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-white/80">Phone</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        value={heading.phone} 
                        onChange={(e) => updateHeading({ phone: e.target.value })} 
                        placeholder="32 202 3456"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label className="text-white/80">Email Address *</Label>
                    <Input 
                        className="border-white/15 bg-[#0f172a] text-white placeholder:text-white/40 focus-visible:ring-[#f97316]"
                        type="email"
                        value={heading.email} 
                        onChange={(e) => updateHeading({ email: e.target.value })} 
                        placeholder="akua.mensah@email.com"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label className="text-white/80">Professional Summary</Label>
                    <textarea
                        className="w-full h-32 rounded-md border border-white/15 bg-[#0f172a] p-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                        value={summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        placeholder="Write a short summary highlighting your strengths and goals..."
                    />
                </div>
            </div>
        </div>
    );
}

