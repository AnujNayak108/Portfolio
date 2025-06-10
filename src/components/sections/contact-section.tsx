
'use client';

import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from 'lucide-react';

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "EmailJS is not configured. Please contact the site administrator.",
      });
      console.error("EmailJS environment variables are not set. Ensure NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY are in your .env file.");
      setIsSubmitting(false);
      return;
    }

    // Ensure the formRef is current if you choose to use sendForm
    // For send, we use the formData state directly.
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      // Add any other parameters your EmailJS template expects
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full section-padding bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 flex items-center justify-center">
          <Mail className="h-10 w-10 text-primary mr-3" />
          Get In Touch
        </h2>
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Contact Me</CardTitle>
            <CardDescription className="text-center">
              Have a project idea or just want to say hi? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-md">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" // Required for emailjs.sendForm if used directly with form element
                  type="text" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-md">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" // Required for emailjs.sendForm
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-md">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" // Required for emailjs.sendForm
                  placeholder="Your message here..." 
                  rows={5} 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="text-base"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-lg py-6 group">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
