import React, { useState } from 'react'

const NewsLetterBox = () => {
    const [emailBoxContent, setEmailBoxContent] = useState('');
    const OnSubmitHandler = (e) => {
        e.preventDefault();

        console.log(emailBoxContent);
        setEmailBoxContent("")
    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
            <p className='text-gray-400 mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            {/* flex-1 = “jitni jagah bachi hai, main le lunga” */}
            <form onSubmit={OnSubmitHandler} className='w-full sm:w-1/2 flex flex-col sm:flex-row sm:border items-center gap-3 mx-auto my-6  pl-3' action="">
                <input className='border p-2 sm:border-none w-full sm:flex-1 outline-none' type="email" placeholder='Enter Your Email' value={emailBoxContent} onChange={(ev) => setEmailBoxContent(ev.target.value)} required />
                <button className='bg-black text-white text-xs px-10 py-4 hover:bg-black/80 hover:backdrop-blur-md transition-all duration-300 group' type='submit'>
                    <span className="text-xs sm:text-sm inline-block transition-all duration-300 transform group-hover:scale-110 ">
                        Subscribe
                    </span></button>
            </form>

        </div>
    )
}

export default NewsLetterBox