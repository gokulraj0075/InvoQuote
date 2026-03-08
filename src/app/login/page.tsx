"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/server/better-auth/client";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		await authClient.signIn.email({
			email,
			password,
		});

		router.push("/dashboard");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Access your InvoQuote dashboard</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label>Email</Label>
						<Input
							onChange={(e) => setEmail(e.target.value)}
							placeholder="john@example.com"
							type="email"
							value={email}
						/>
					</div>

					<div className="space-y-2">
						<Label>Password</Label>
						<Input
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter password"
							type="password"
							value={password}
						/>
					</div>

					<Button className="w-full" onClick={handleLogin}>
						Login
					</Button>

					<p className="text-center text-muted-foreground text-sm">
						Don’t have an account?{" "}
						<Link className="font-medium underline" href="/register">
							Register
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
