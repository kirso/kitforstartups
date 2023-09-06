import {
	generatePasswordResetToken,
	getUserByEmail,
	getUserProfileData
} from '$lib/drizzle/models/users';
import { sendEmail } from '$lib/emails/resend';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/app/profile');
	}
};

export const actions = {
	sendPasswordResetLink: async ({ request, url }) => {
		const formData = Object.fromEntries(await request.formData());

		// TODO: validation
		const { email } = formData as {
			email: string;
		};

		const storedUser = await getUserByEmail(email);

		if (!storedUser) {
			return fail(400, {
				message: 'User does not exist'
			});
		}

		const profile = await getUserProfileData(storedUser.id);

		try {
			const resetToken = await generatePasswordResetToken(storedUser.id);

			const sender = 'KitForStartups <justin@updates.okupter.com>';
			const recipient = profile?.firstName ? `${profile.firstName}` : storedUser.email;
			const emailHtml = `Hello ${recipient},<br><br>Here is your password reset link:<br><br><a href="${url.origin}/password-reset/${resetToken}">Reset Password</a><br><br>Thanks,<br>Justin from KitForStartups`;

			await sendEmail({
				from: sender,
				to: storedUser.email as string,
				subject: 'Password Reset',
				html: emailHtml
			});

			return {
				success: true
			};
		} catch (error) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
