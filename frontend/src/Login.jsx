import React, { useState, useEffect, useRef } from 'react'
import { timeline } from '@motionone/dom'

const Login = () => {
    const [name, setName] = useState('')
    const [pin, setPin] = useState('')
    const [error, setError] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const textRef = useRef(null);

    useEffect(() => {
        const svg = textRef.current;

        const letters = Array.from(svg.querySelectorAll('text path'));
        const animation = timeline(letters.map((letter, i) => [
            letter,
            { strokeDashoffset: [letter.getTotalLength(), 0] },
            { duration: 4, delay: i * 0.25, fill: 'forwards' }
        ]));

        return () => animation.stop();
    }, []);

    useEffect(() => {
        const storedName = localStorage.getItem('buyerName')
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
        if (storedName && storedIsLoggedIn === 'true') {
            setName(storedName)
            setIsLoggedIn(true)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('buyerName');
        window.location.href = '/';
    }

    const handleCart = () => {
        window.location.href = '/cart';
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://ventura-brandbuilderbattle.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, pin }),
            });
            const data = await response.json()
            if (data.status === 'success') {
                localStorage.setItem('buyerName', name)
                localStorage.setItem('isLoggedIn', 'true')
                setIsLoggedIn(true);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Error logging in. Please try again.')
        }
    }

    if (isLoggedIn) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 via-black to-blue-900 animate-flow">
                <div className="relative px-4 md:px-0 pt-4 w-full group flex flex-col justify-center items-center">
                    <svg
                        ref={textRef}
                        viewBox="0 0 150 20"
                        className="h-24 w-full text-center"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.1"
                    >
                        <text x="75" y="15" textAnchor="middle" className="text-stone-300 font-poppins font-extrabold text-lg">
                            <tspan className="stroke-dasharray">VENTURA</tspan>
                        </text>
                    </svg>
                </div>
                <div className="text-white text-center flex flex-col space-y-6">
                    <h2 className="text-3xl font-bold mb-6">Welcome, {name}!</h2>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-300 font-bold"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleCart}
                        className="px-6 py-2 bg-white hover:bg-red-500 text-black rounded-full transition duration-300 font-bold"
                    >
                        cart
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 via-black to-blue-900 animate-flow">
            <div className="relative px-4 md:px-0 pt-4 w-full group flex flex-col justify-center items-center">
                <svg
                    ref={textRef}
                    viewBox="0 0 150 20"
                    className="h-24 w-full text-center"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.1"
                >
                    <text x="75" y="15" textAnchor="middle" className="text-stone-300 font-poppins font-extrabold text-lg">
                        <tspan className="stroke-dasharray">VENTURA</tspan>
                    </text>
                </svg>
                <p className='text-md font-sans text-stone-300 text-center pb-4 '>Brought to you by ECELL GEC in Collaboration with Vibrant Goa</p>
            </div>
            <div className="mx-4 p-5 w-4/5 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg border border-opacity-20 border-white">
                <h2 className="text-2xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 stroke-white stroke-1 mb-2">Brand Builder Battle</h2>
                <h3 className="text-xl font-semibold text-center text-gray-100 mb-6">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-100 font-semibold mb-2">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-100 font-semibold mb-2">PIN:</label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full p-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                            placeholder="Enter your PIN"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:bg-gradient-to-l hover:from-orange-500 hover:to-yellow-500 transition duration-300"
                    >
                        Login
                    </button>
                    {error && (
                        <div className="text-red-500 text-sm text-center mt-4">{error}</div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Login