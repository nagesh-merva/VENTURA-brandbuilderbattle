import { useState, useEffect } from 'react';
import Footer from './Footer';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 }); // Initialize with default values
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCart = async () => {
            const storedName = localStorage.getItem('buyerName')
            try {
                const response = await fetch('https://ventura-brandbuilderbattle.onrender.com/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ buyername: storedName })
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData)
                    setCart(responseData);
                } else {
                    const errorResponse = await response.json();
                    alert('Failed to get response', errorResponse);
                }
            } catch (error) {
                alert('Failed due to Bad Connection. Try Again');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleLogin = () => {
        window.location.href = '/';
    }

    const handleLogout = () => {
        localStorage.removeItem('buyerName');
        window.location.href = '/';
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md pt-10">
            <header className="text-center bg-blue-600 text-white py-8 rounded-lg shadow-lg mb-10">
                <h1 className="text-3xl font-bold">Brand Builder Battle at Ventura</h1>
                <p className="mt-2 text-lg">Brought to you by GEC E-Cell in collaboration with Vibrant Goa</p>
            </header>

            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <ul className="space-y-2">
                {cart.items.length > 0 ? (
                    cart.items.map(item => (
                        <li key={item.id} className="p-2 bg-white border border-gray-300 rounded-lg">
                            {item.name}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Your cart is empty.</li>
                )}
            </ul>
            <p className="mt-4 text-xl font-bold text-blue-600">Remaining Balance: {cart.total} </p>

            <div className="text-white pt-10 text-center flex flex-col space-y-6">
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-300 font-bold"
                >
                    Logout
                </button>
                <button
                    onClick={handleLogin}
                    className="px-6 py-2 bg-white hover:bg-red-500 text-black rounded-full transition duration-300 font-bold"
                >
                    Home
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
