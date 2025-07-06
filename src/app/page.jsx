'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const GetStarted = () => {
    const router = useRouter()

    const handleGetStarted = () => {
      router.push('/login')
    }

    return (
      <div className='w-full h-screen flex justify-center items-center overflow-hidden'>
        <div className='absolute top-0 bg-[url("/Vector-top.svg")] w-full h-1/6 bg-no-repeat bg-bottom'></div>
        <div className='py-3 sm:py-4 mx-10 mt-6 w-full h-2/3 flex flex-col justify-between items-center gap-16 select-none'>
          <div className='Logo flex w-full gap-4 items-center justify-center'>
            <img src='/Main-Logo.svg' alt='Logo' className='w-20 h-20' />
            <div className='logo-right'>
              <div className='text-6xl font-bold text-orange-600'>Snakk</div>
              <div className='text-xl italic opacity-80'>For Hostellers Only</div>
            </div>
          </div>
          <div className='features-1 flex'>
            <div className='flex flex-col gap-8 items-start justify-center w-full'>
              <div className='flex justify-center items-end gap-5'>
                <img src="/fries-icon.svg" alt="Fries Icon" className='w-10' />
                <div className='flex flex-col items-start justify-center text-[#686868]'>
                  <div className='text-xl font-semibold'>Late-night cravings?</div>
                  <div className='text-md font-semibold leading-tight'>Buy snacks from your hostel</div>
                </div>
              </div>
              <div className='flex justify-center items-end gap-5'>
                <img src="/box-icon.svg" alt="Box Icon" className='w-10' />
                <div className='flex flex-col items-start justify-center text-[#686868]'>
                  <div className='text-xl font-semibold'>Got extra stock?</div>
                  <div className='text-md font-semibold leading-tight'>Sell What you have</div>
                </div>
              </div>
            </div>
          </div>
          <div className='quote flex flex-col text-orange-500/70 font-semibold text-2xl text-center w-full leading-snug'>
            <span>"Snakk lets you buy and sell</span>
            <span>snacks easily with students</span>
            <span>in your hostel."</span>
          </div>
          <div className='cta flex items-center justify-center w-full'>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-[#ff6e42] to-[#FF3D00] text-white text-xl font-semibold w-full py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-[#FF3D00] hover:to-[#FF5824] transform active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    )
  }

export default GetStarted