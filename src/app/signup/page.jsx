'use client'
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const socialLoginOptions = [
        { name: "Google", src: "/google.svg", alt: "Google" },
        { name: "Facebook", src: "/facebook.svg", alt: "Facebook" },
        { name: "Apple", src: "/apple.svg", alt: "Apple" },
    ];

    return (
        <div className="w-full h-screen flex flex-col justify-around items-center overflow-hidden relative px-10 pb-40">
            <div className='absolute -z-10 bottom-0 opacity-50 bg-[url("/Signup-bottom.svg")] w-full h-full bg-no-repeat bg-bottom'></div>
            <div className="text-4xl font-semibold">Sign Up</div>
            <div className="w-full h-1/2 flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center gap-8 w-full">
                    <div className="input-fields flex flex-col w-full gap-5">
                        <input className="email w-full h-12 border rounded-xl text-orange-600 text-medium border-[#fb6e43] px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 focus:scale-[1.02]" type="text" placeholder="Full Name" />
                        <input className="email w-full h-12 border rounded-xl text-orange-600 text-medium border-[#fb6e43] px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 focus:scale-[1.02]" type="email" placeholder="Email" />
                        <div className="relative w-full">
                            <input
                                className="email w-full h-12 border rounded-xl text-orange-600 text-medium border-[#fb6e43] px-4 pr-12 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 focus:scale-[1.02]"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        </div>
                        <div className="relative w-full">
                            <input
                                className="email w-full h-12 border rounded-xl text-orange-600 text-medium border-[#fb6e43] px-4 pr-12 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 focus:scale-[1.02]"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                            >
                                {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className='cta flex items-center justify-center w-full'>
                        <button
                            className="bg-gradient-to-r from-[#ff6e42] to-[#FF3D00] text-white text-xl font-semibold w-full py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-[#FF3D00] hover:to-[#FF5824] transform active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                </div >
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <div className="separator flex items-center w-full my-4">
                        <div className="flex-1 h-[0.5px] bg-black/60"></div>
                        <span className="px-4 text-black text-sm">OR</span>
                        <div className="flex-1 h-[0.5px] bg-black/60"></div>
                    </div>
                    <div className="social-login flex justify-center items-center gap-8">
                        {socialLoginOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={option.name === "Google" ? () => signIn("google", { callbackUrl: '/home' }) : undefined}
                                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <img
                                    src={option.src}
                                    alt={option.alt}
                                    className="w-6 h-6"
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    Already have an account?
                    <a className="text-orange-600 font-semibold" href="/login"> Login</a>
                </div>
            </div>
        </div>
    );
};

export default Signup