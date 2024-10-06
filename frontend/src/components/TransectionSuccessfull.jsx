// TransactionSuccess.js
import React from 'react';
import transaction from '../assets/transaction.gif'

const TransactionSuccess = ({ onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-lg flex flex-col justify-center items-center text-center">
                <img src={transaction} alt="Success GIF" />
                <h2 className="mt-4 text-2xl font-bold">Transaction Successful!</h2>
                <button
                    onClick={onComplete}
                    className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Go to Cart
                </button>
            </div>
        </div>
    );
};

export default TransactionSuccess;
