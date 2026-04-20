import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/lib/auth";

export const Route = createFileRoute("/signin")({
	component: SignInPage,
});

function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message ?? "Invalid credentials");
				return;
			}

			window.location.href = "/";
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="font-curator flex min-h-[100dvh] items-center justify-center bg-curator-surface antialiased">
			<div className="w-full max-w-md">
				<div className="mb-8 flex flex-col items-center">
					<div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-curator-primary font-bold text-curator-on-primary text-xl">
						AC
					</div>
					<h1 className="text-2xl font-bold tracking-tight text-curator-on-background">
						Sign in to Admin
					</h1>
					<p className="mt-1 text-sm text-curator-on-surface-variant">
						Enter your credentials to access the dashboard
					</p>
				</div>

				<div className="rounded-xl bg-curator-surface-container-lowest p-8 shadow-[0_20px_40px_-15px_rgba(0,30,64,0.08)]">
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="email"
								className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-curator-on-surface-variant"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								required
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-11 w-full rounded-lg border border-curator-outline-variant/30 bg-curator-surface px-4 text-sm text-curator-on-background placeholder:text-curator-on-surface-variant/50 focus:border-curator-primary focus:outline-none focus:ring-2 focus:ring-curator-primary/20"
								placeholder="you@company.com"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-curator-on-surface-variant"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								required
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-11 w-full rounded-lg border border-curator-outline-variant/30 bg-curator-surface px-4 text-sm text-curator-on-background placeholder:text-curator-on-surface-variant/50 focus:border-curator-primary focus:outline-none focus:ring-2 focus:ring-curator-primary/20"
								placeholder="••••••••"
							/>
						</div>

						{error && (
							<div className="rounded-lg bg-curator-error-container/50 px-4 py-3 text-sm font-medium text-curator-error">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-br from-curator-primary to-curator-primary-container font-semibold text-curator-on-primary shadow-[0_4px_12px_-4px_rgba(0,30,64,0.4)] transition hover:opacity-95 disabled:opacity-60"
						>
							{loading ? "Signing in…" : "Sign in"}
						</button>
					</form>
				</div>

				<p className="mt-6 text-center text-xs text-curator-on-surface-variant">
					Academic Curator &middot; Admin Console
				</p>
			</div>
		</div>
	);
}