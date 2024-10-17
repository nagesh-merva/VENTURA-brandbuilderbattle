import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TransactionSuccess from './TransectionSuccessfull'
import Footer from './Footer';

const ProductDetail = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [price, setPrice] = useState('65')
    const [pin, setPin] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [transactionSuccess, setTransactionSuccess] = useState(false)
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    console.log(productId)

    useEffect(() => {
        const storedName = localStorage.getItem('buyerName')
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
        if (storedName && storedIsLoggedIn === 'true') {
            setName(storedName)
            setIsLoggedIn(true)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        const url = `https://ventura-brandbuilderbattle.onrender.com/api/product/${productId}`
        const fetchProduct = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const responseData = await response.json()
                    console.log(responseData)
                    setProduct(responseData.Product)
                } else {
                    const errorResponse = await response.json()
                    alert('Failed to get response', errorResponse)
                }
            } catch (error) {
                alert('Failed due to Bad Connection. Try Again')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productId])

    const handleBuy = async () => {
        if (!name || !price || !pin) {
            alert('All fields are required')
            return
        }

        if (price < 50) {
            alert('Minimum price is 50!')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('https://ventura-brandbuilderbattle.onrender.com/api/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, price, pin, name }),
            })
            if (response.ok) {
                setTransactionSuccess(true)
            } else {
                const errorResponse = await response.json()
                alert(`Error: ${errorResponse.message}`)
            }
        } catch (error) {
            console.error('Error buying product:', error)
            alert('Failed to process the purchase. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteTransaction = () => {
        navigate('/cart')
    }

    if (transactionSuccess) {
        return <TransactionSuccess onComplete={handleCompleteTransaction} amount={price} />
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-svh w-full">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                <p className="ml-4 text-lg font-semibold text-gray-600">Loading Product...</p>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
            <header className="text-center bg-blue-600 text-white py-8 rounded-lg shadow-lg mb-10">
                <h1 className="text-3xl font-bold">Brand Builder Battle at Ventura</h1>
                <p className="mt-2 text-lg">Brought to you by GEC E-Cell in collaboration with Vibrant Goa</p>
            </header>

            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    <p className="ml-4 text-lg font-semibold text-gray-600">Loading ...</p>
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    <input
                        type="number"
                        placeholder="Enter your price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Enter your pin"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                    />
                    <button
                        onClick={handleBuy}
                        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Buy
                    </button>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default ProductDetail;
