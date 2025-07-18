"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'Login Successful', description: "Welcome back!" });
      router.push('/booking');
    } catch (error: any) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please try again.';
        }
      toast({ variant: 'destructive', title: 'Login Failed', description: errorMessage });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-10 px-4">
       <Link href="/" className="text-sm text-primary hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Stethoscope className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Log In to DR Medlab</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Log In
                    </Button>
                </form>
                </Form>
                 <div className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/register" className="underline text-primary">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
