'use client';

import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const OutgoingDetails = () => {
  const [outgoingDetails, setOutgoingDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    'S.No': '',
    'Product Name': '',
    'Batch  No': '',
    'Manufacturer name': '',
    'Mfg.Date': '',
    'Expiry .Date': '',
    'Qty. Sent': '',
    'Sent Date': '',
    'Sample Type ': '',
    'Sample Sent to': '',
    'Courier details': '',
    'Comment': ''
  });
  const [editDetail, setEditDetail] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log('Fetching outgoing details...');
        const querySnapshot = await getDocs(collection(db, 'outcoming_details'));
        console.log('Query snapshot:', querySnapshot);
        const details = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched details:', details);

        // If collection is empty, add a test entry
        if (details.length === 0) {
          console.log('Collection is empty, adding test entry...');
          const testEntry = {
            'S.No': '1',
            'Product Name': 'Test Product',
            'Batch  No': 'TEST001',
            'Manufacturer name': 'Test Manufacturer',
            'Mfg.Date': '2024-01-01',
            'Expiry .Date': '2025-01-01',
            'Qty. Sent': '1 Kg',
            'Sent Date': '2024-03-20',
            'Sample Type ': 'Powder',
            'Sample Sent to': 'Test Company',
            'Courier details': 'Test Courier Details',
            'Comment': 'Test entry'
          };
          const docRef = await addDoc(collection(db, 'outcoming_details'), testEntry);
          details.push({ id: docRef.id, ...testEntry });
          console.log('Test entry added:', testEntry);
        }

        // Sort by S.No
        details.sort((a, b) => {
          const aNo = parseInt(a['S.No']) || 0;
          const bNo = parseInt(b['S.No']) || 0;
          return aNo - bNo;
        });
        console.log('Sorted details:', details);
        setOutgoingDetails(details);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, []);

  const addDetail = async () => {
    try {
      const docRef = await addDoc(collection(db, 'outcoming_details'), newDetail);
      const updatedDetails = [...outgoingDetails, { id: docRef.id, ...newDetail }];
      // Sort by S.No
      updatedDetails.sort((a, b) => {
        const aNo = parseInt(a['S.No']) || 0;
        const bNo = parseInt(b['S.No']) || 0;
        return aNo - bNo;
      });
      setOutgoingDetails(updatedDetails);
      setNewDetail({
        'S.No': '',
        'Product Name': '',
        'Batch  No': '',
        'Manufacturer name': '',
        'Mfg.Date': '',
        'Expiry .Date': '',
        'Qty. Sent': '',
        'Sent Date': '',
        'Sample Type ': '',
        'Sample Sent to': '',
        'Courier details': '',
        'Comment': ''
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const editDetailFunc = async (id) => {
    if (editDetail) {
      const docRef = doc(db, 'outcoming_details', id);
      try {
        await updateDoc(docRef, editDetail);
        const updatedDetails = outgoingDetails.map((detail) =>
          detail.id === id ? { ...detail, ...editDetail } : detail
        );
        // Sort by S.No
        updatedDetails.sort((a, b) => {
          const aNo = parseInt(a['S.No']) || 0;
          const bNo = parseInt(b['S.No']) || 0;
          return aNo - bNo;
        });
        setOutgoingDetails(updatedDetails);
        setEditDetail(null);
      } catch (e) {
        console.error('Error updating document: ', e);
      }
    }
  };

  const deleteDetail = async (id) => {
    const docRef = doc(db, 'outcoming_details', id);
    try {
      await deleteDoc(docRef);
      const remainingDetails = outgoingDetails.filter((detail) => detail.id !== id);
      // Sort by S.No
      remainingDetails.sort((a, b) => {
        const aNo = parseInt(a['S.No']) || 0;
        const bNo = parseInt(b['S.No']) || 0;
        return aNo - bNo;
      });
      setOutgoingDetails(remainingDetails);
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Outgoing Details</h1>

      {/* Add new outgoing detail */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Add New Detail</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="S.No"
            value={newDetail['S.No']}
            onChange={(e) => setNewDetail({ ...newDetail, 'S.No': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Product Name"
            value={newDetail['Product Name']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Product Name': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Batch No"
            value={newDetail['Batch  No']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Batch  No': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Manufacturer Name"
            value={newDetail['Manufacturer name']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Manufacturer name': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Mfg Date"
            value={newDetail['Mfg.Date']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Mfg.Date': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={newDetail['Expiry .Date']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Expiry .Date': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Quantity Sent"
            value={newDetail['Qty. Sent']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Qty. Sent': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Sent Date"
            value={newDetail['Sent Date']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Sent Date': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Sample Type"
            value={newDetail['Sample Type ']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Sample Type ': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Sample Sent To"
            value={newDetail['Sample Sent to']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Sample Sent to': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Courier Details"
            value={newDetail['Courier details']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Courier details': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Comment"
            value={newDetail['Comment']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Comment': e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button 
          onClick={addDetail}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* List all outgoing details */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">S.No</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Batch No</th>
              <th className="border p-2">Manufacturer</th>
              <th className="border p-2">Mfg Date</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Qty Sent</th>
              <th className="border p-2">Sent Date</th>
              <th className="border p-2">Sample Type</th>
              <th className="border p-2">Sent To</th>
              <th className="border p-2">Courier Details</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {outgoingDetails.map((detail) => (
              <tr key={detail.id}>
                <td className="border p-2">{detail['S.No']}</td>
                <td className="border p-2">{detail['Product Name']}</td>
                <td className="border p-2">{detail['Batch  No']}</td>
                <td className="border p-2">{detail['Manufacturer name']}</td>
                <td className="border p-2">{detail['Mfg.Date']}</td>
                <td className="border p-2">{detail['Expiry .Date']}</td>
                <td className="border p-2">{detail['Qty. Sent']}</td>
                <td className="border p-2">{detail['Sent Date']}</td>
                <td className="border p-2">{detail['Sample Type ']}</td>
                <td className="border p-2">{detail['Sample Sent to']}</td>
                <td className="border p-2">{detail['Courier details']}</td>
                <td className="border p-2">{detail['Comment']}</td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditDetail(detail)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDetail(detail.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit form */}
      {editDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Detail</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="S.No"
                value={editDetail['S.No']}
                onChange={(e) => setEditDetail({ ...editDetail, 'S.No': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Product Name"
                value={editDetail['Product Name']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Product Name': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Batch No"
                value={editDetail['Batch  No']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Batch  No': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Manufacturer Name"
                value={editDetail['Manufacturer name']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Manufacturer name': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Mfg Date"
                value={editDetail['Mfg.Date']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Mfg.Date': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={editDetail['Expiry .Date']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Expiry .Date': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Quantity Sent"
                value={editDetail['Qty. Sent']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Qty. Sent': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Sent Date"
                value={editDetail['Sent Date']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Sent Date': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Sample Type"
                value={editDetail['Sample Type ']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Sample Type ': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Sample Sent To"
                value={editDetail['Sample Sent to']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Sample Sent to': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Courier Details"
                value={editDetail['Courier details']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Courier details': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Comment"
                value={editDetail['Comment']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Comment': e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => editDetailFunc(editDetail.id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditDetail(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutgoingDetails;
