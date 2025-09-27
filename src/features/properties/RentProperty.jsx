import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../ui/Pagination";
import Filter from "../../ui/Filter";
import useProperties from "./useProperties";
import RentPropertyInteractive from "./RentPropertyInteractive";
import Spinner from "../../ui/Spinner";
import { ChevronLeft, ChevronRight, List, Grid3X3, MapPin } from "lucide-react";
import useInfiniteProperties from "./useInfiniteProperties";
import { useAuth } from "../../context/AuthContext";

function RentProperty() {
    const [view, setView] = useState("grid");
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentUser } = useAuth();
    
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const sort = searchParams.get("sort") || "";
    const status = searchParams.get("status") || "";
    const area = searchParams.get("area") || "";
    const propertyType = searchParams.get("propertyType") || "";
    const furnishingStatus = searchParams.get("furnishingStatus") || "";
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const bedrooms = searchParams.get("bedrooms") || "";
    const bathrooms = searchParams.get("bathrooms") || "";
    const size = searchParams.get("size") || "";

    // For pagination view 
    const { isLoading, data, refetch } = useProperties({
        page, 
        sortLabel: sort, 
        status,
        area,
        propertyType,
        furnishingStatus,
        priceMin,
        priceMax,
        bedrooms,
        bathrooms,
        size,
        type: "RENT", // Specifying RENT type
        userId: currentUser?.role === "admin" ? null : currentUser?.id
    });

    // For interactive/grid view with infinite scroll
    const {
        data: infiniteData,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProperties({
        sortLabel: sort,
        status,
        area,
        propertyType,
        furnishingStatus,
        priceMin,
        priceMax,
        bedrooms,
        bathrooms,
        size,
        type: "RENT", // Specifying RENT type
        userId: currentUser?.role === "admin" ? null : currentUser?.id
    });

    // Flatten pages for interactive view
    const flattenedData = infiniteData?.pages?.flatMap((page) => page) ?? [];

    function handlePageChange(newPage) {
        searchParams.set("page", newPage);
        setSearchParams(searchParams);
    }

    return (
        <div className="flex">
            <div className="w-1/4 p-4 bg-white rounded-lg shadow mr-4">
                <h2 className="text-xl font-semibold mb-4">फिल्टर</h2>
                <Filter>
                    <Filter.Input registerName="title" placeholder="नाम" />
                    <Filter.InputSelect 
                        registerName="propertyType"
                        placeholder="प्रॉपर्टी प्रकार"
                    />
                    <Filter.InputSelect 
                        registerName="area"
                        placeholder="क्षेत्र"
                    />
                    <Filter.InputSelect 
                        registerName="furnishingStatus"
                        placeholder="फ़र्निशिंग स्थिति"
                    />
                    <Filter.Input registerName="priceMin" placeholder="न्यूनतम मूल्य" type="number" />
                    <Filter.Input registerName="priceMax" placeholder="अधिकतम मूल्य" type="number" />
                    <Filter.InputSelect 
                        registerName="bedrooms"
                        placeholder="बेडरूम"
                    />
                    <Filter.InputSelect 
                        registerName="bathrooms"
                        placeholder="बाथरूम"
                    />
                    <Filter.Input registerName="size" placeholder="आकार (sq.ft)" type="number" />
                    <button 
                        className="w-full mt-4 bg-primary text-white p-2 rounded"
                        onClick={() => {
                            searchParams.delete("page");
                            refetch();
                            setSearchParams(searchParams);
                        }}
                    >
                        फिल्टर लागू करें
                    </button>
                </Filter>
            </div>

            <div className="flex-1 p-4">
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">किराये की संपत्तियां</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setView("list")}
                            className={`p-2 rounded ${
                                view === "list"
                                    ? "bg-primary text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setView("grid")}
                            className={`p-2 rounded ${
                                view === "grid"
                                    ? "bg-primary text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            <Grid3X3 size={20} />
                        </button>
                        <button
                            onClick={() => setView("map")}
                            className={`p-2 rounded ${
                                view === "map"
                                    ? "bg-primary text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            <MapPin size={20} />
                        </button>
                    </div>
                </div>

                {view === "grid" && (
                    <RentPropertyInteractive
                        isLoading={!infiniteData}
                        data={flattenedData}
                        error={error}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
                {view === "list" && (
                    <div>
                        {isLoading ? (
                            <Spinner />
                        ) : data?.result?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
                                <div className="bg-gray-100 p-8 rounded-full mb-8">
                                    <svg
                                        className="w-16 h-16 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    कोई संपत्ति नहीं मिली
                                </h2>
                                <p className="text-gray-600 text-lg text-center max-w-md">
                                    अपनी खोज को व्यापक बनाने के लिए मूल्य सीमा या स्थान को समायोजित करने का प्रयास करें
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* List View Table Here */}
                                <div className="overflow-x-auto bg-white rounded-lg shadow">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    प्रॉपर्टी
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    मूल्य
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    प्रकार
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    क्षेत्र
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    स्थिति
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    कार्रवाई
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data?.result?.map((property) => (
                                                <tr
                                                    key={property.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={
                                                                        property.photos?.[0] ||
                                                                        "https://via.placeholder.com/150"
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {property.title}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {property.bedRooms} बेडरूम, {property.bathrooms} बाथरूम
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {property.price?.toLocaleString()} AED / {property.rentFrequency || "year"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {property.property_type}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {property.area?.name || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${property.status === "ACTIVE" ? "bg-green-100 text-green-800" : 
                                                            property.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                                                            "bg-red-100 text-red-800"}`}>
                                                            {property.status || "ACTIVE"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <a
                                                            href={`/for-rent/new-list/${property.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                        >
                                                            देखें
                                                        </a>
                                                        <a
                                                            href={`/for-rent/edit/${property.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            संपादित करें
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-center mt-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                page === 1
                                                    ? "bg-gray-200 cursor-not-allowed"
                                                    : "bg-primary text-white hover:bg-primary-dark"
                                            }`}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <Pagination
                                            currentPage={page}
                                            totalPages={data?.totalPages || 1}
                                            onPageChange={handlePageChange}
                                        />
                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === data?.totalPages}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                page === data?.totalPages
                                                    ? "bg-gray-200 cursor-not-allowed"
                                                    : "bg-primary text-white hover:bg-primary-dark"
                                            }`}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {view === "map" && (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            नक्शा दृश्य जल्द ही आ रहा है
                        </h2>
                        <p className="text-gray-600">
                            हम इस सुविधा पर काम कर रहे हैं। कृपया बाद में फिर से जांचें।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RentProperty; 