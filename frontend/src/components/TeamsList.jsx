import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://ventura-brandbuilderbattle.onrender.com/api/teams', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                setTeams(responseData.teams);
            } else {
                const errorResponse = await response.json();
                alert('Failed to get response');
            }
        } catch (error) {
            alert('Failed due to Bad Connection. Try Again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Header Section */}
            <header className="text-center bg-blue-600 text-white py-8 rounded-lg shadow-lg mb-10">
                <h1 className="text-3xl font-bold">Brand Builder Battle at Ventura</h1>
                <p className="mt-2 text-lg">Brought to you by GEC E-Cell in collaboration with Vibrant Goa</p>
            </header>

            {/* Team and Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Meet the Teams and Explore Their Products</h2>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        <p className="ml-4 text-lg font-semibold text-gray-600">Loading teams...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {teams.map(team => (
                            <div key={team.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <Link to={`/product/${team.product.name}`}>
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={team.product.imageUrl}
                                        alt={team.product.name}
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{team.product.name}</h3>
                                        <p className="mt-2 text-gray-600">{team.product.description}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamList;
