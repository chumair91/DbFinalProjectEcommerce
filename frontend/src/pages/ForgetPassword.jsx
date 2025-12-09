import React, { useState } from 'react';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        console.log('Forgot password requested for:', email);
        // No backend call here — you'll wire that up later
    };

    return (
        <div className="max-w-md mx-auto my-8 p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!email}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Submit
                </button>
            </form>

            {submitted && (
                <p className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800">
                    Submitted: <strong>{email}</strong>
                </p>
            )}
        </div>
    );
};

export default ForgetPassword;