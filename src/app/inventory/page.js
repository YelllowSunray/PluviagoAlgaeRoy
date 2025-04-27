'use client';

import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const collections = [
  'LP3k.miscellaneous_short',
  'LP3j.Electricals_short',
  'LP3c.PBR1_short',
  'LP3h.Biological_samples_short',
  'LP3g.Stationery_short',
  'LP3f.Disposables_short',
  'LP3e.Plasticwares_short',
  'LP3d.Glasswares_short',
  'PBR_short',
  'LP3i.Others_short',
  'LP3b.Chemicals_short',
  'LP3a.Equipment_short'
];

const InventoryPage = () => {
  const [activeCollection, setActiveCollection] = useState(collections[0]);
  const [inventoryData, setInventoryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCollections = async () => {
      setLoading(true);
      const data = {};
      
      for (const collectionName of collections) {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          data[collectionName] = items;
        } catch (error) {
          console.error(`Error fetching ${collectionName}:`, error);
          data[collectionName] = [];
        }
      }
      
      setInventoryData(data);
      setLoading(false);
    };

    fetchAllCollections();
  }, []);

  const renderTable = (items) => {
    if (!items || items.length === 0) {
      return <p className="text-gray-500">No data available</p>;
    }

    const headers = Object.keys(items[0]).filter(key => key !== 'id');

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 border-b text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={`${item.id}-${header}`} className="px-4 py-2 border-b">
                    {item[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      
      {/* Collection Selector */}
      <div className="mb-6">
        <label htmlFor="collection-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Collection
        </label>
        <select
          id="collection-select"
          value={activeCollection}
          onChange={(e) => setActiveCollection(e.target.value)}
          className="block w-full max-w-md px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {collections.map((collectionName) => (
            <option key={collectionName} value={collectionName}>
              {collectionName}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">{activeCollection}</h2>
            {renderTable(inventoryData[activeCollection])}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
