import { useState, useEffect } from 'react';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 }); // Initialize with default values
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
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
            <p className="mt-4 text-lg font-semibold">Total: {cart.total} </p>
        </div>
    );
};

export default Cart;
