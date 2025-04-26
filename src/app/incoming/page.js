'use client';

import { useState, useEffect } from 'react';
import { db } from '@/config/firebase'; // Import dbClient
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const IncomingDetails = () => {
  const [incomingDetails, setIncomingDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    'S.No': '',
    'Product Name': '',
    'Product code': '',
    'Manufacturer name': '',
    'Mfg.Date': '',
    'Expiry Date': '',
    'Qty. Received': '',
    'Received Date': '',
    'Invoice no:': '',
    'Invoice date ': '',
    'Sample Type ': '',
    'Sample Received From': '',
    'Comment': ''
  });
  const [editDetail, setEditDetail] = useState(null);

  // Fetch incoming details from Firestore
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log('Fetching details...');
      const querySnapshot = await getDocs(collection(db, 'incoming_details'));
        console.log('Query snapshot:', querySnapshot);
      const details = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
        // Sort by S.No
        details.sort((a, b) => {
          const aNo = parseInt(a['S.No']) || 0;
          const bNo = parseInt(b['S.No']) || 0;
          return aNo - bNo;
        });
        console.log('Fetched details:', details);
        console.log('S.No order:', details.map(d => d['S.No']));
      setIncomingDetails(details);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, []);

  // Add new incoming detail
  const addDetail = async () => {
    try {
      const docRef = await addDoc(collection(db, 'incoming_details'), newDetail);
      const updatedDetails = [...incomingDetails, { id: docRef.id, ...newDetail }];
      // Sort by S.No
      updatedDetails.sort((a, b) => {
        const aNo = parseInt(a['S.No']) || 0;
        const bNo = parseInt(b['S.No']) || 0;
        return aNo - bNo;
      });
      setIncomingDetails(updatedDetails);
      setNewDetail({
        'S.No': '',
        'Product Name': '',
        'Product code': '',
        'Manufacturer name': '',
        'Mfg.Date': '',
        'Expiry Date': '',
        'Qty. Received': '',
        'Received Date': '',
        'Invoice no:': '',
        'Invoice date ': '',
        'Sample Type ': '',
        'Sample Received From': '',
        'Comment': ''
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  // Edit existing incoming detail
  const editDetailFunc = async (id) => {
    if (editDetail) {
      const docRef = doc(db, 'incoming_details', id);
      try {
        await updateDoc(docRef, editDetail);
        const updatedDetails = incomingDetails.map((detail) =>
          detail.id === id ? { ...detail, ...editDetail } : detail
        );
        // Sort by S.No
        updatedDetails.sort((a, b) => {
          const aNo = parseInt(a['S.No']) || 0;
          const bNo = parseInt(b['S.No']) || 0;
          return aNo - bNo;
        });
        setIncomingDetails(updatedDetails);
        setEditDetail(null);
      } catch (e) {
        console.error('Error updating document: ', e);
      }
    }
  };

  // Delete incoming detail
  const deleteDetail = async (id) => {
    const docRef = doc(db, 'incoming_details', id);
    try {
      await deleteDoc(docRef);
      const remainingDetails = incomingDetails.filter((detail) => detail.id !== id);
      // Sort by S.No
      remainingDetails.sort((a, b) => {
        const aNo = parseInt(a['S.No']) || 0;
        const bNo = parseInt(b['S.No']) || 0;
        return aNo - bNo;
      });
      setIncomingDetails(remainingDetails);
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Incoming Details</h1>

      {/* Add new incoming detail */}
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
            placeholder="Product Code"
            value={newDetail['Product code']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Product code': e.target.value })}
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
            value={newDetail['Expiry Date']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Expiry Date': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Quantity Received"
            value={newDetail['Qty. Received']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Qty. Received': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Received Date"
            value={newDetail['Received Date']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Received Date': e.target.value })}
            className="border p-2 rounded"
          />
        <input
          type="text"
            placeholder="Invoice No"
            value={newDetail['Invoice no:']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Invoice no:': e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Invoice Date"
            value={newDetail['Invoice date ']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Invoice date ': e.target.value })}
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
            placeholder="Sample Received From"
            value={newDetail['Sample Received From']}
            onChange={(e) => setNewDetail({ ...newDetail, 'Sample Received From': e.target.value })}
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

      {/* List all incoming details */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">S.No</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Product Code</th>
              <th className="border p-2">Manufacturer</th>
              <th className="border p-2">Mfg Date</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Qty Received</th>
              <th className="border p-2">Received Date</th>
              <th className="border p-2">Invoice No</th>
              <th className="border p-2">Invoice Date</th>
              <th className="border p-2">Sample Type</th>
              <th className="border p-2">Received From</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
        {incomingDetails.map((detail) => (
              <tr key={detail.id}>
                <td className="border p-2">{detail['S.No']}</td>
                <td className="border p-2">{detail['Product Name']}</td>
                <td className="border p-2">{detail['Product code']}</td>
                <td className="border p-2">{detail['Manufacturer name']}</td>
                <td className="border p-2">{detail['Mfg.Date']}</td>
                <td className="border p-2">{detail['Expiry Date']}</td>
                <td className="border p-2">{detail['Qty. Received']}</td>
                <td className="border p-2">{detail['Received Date']}</td>
                <td className="border p-2">{detail['Invoice no:']}</td>
                <td className="border p-2">{detail['Invoice date ']}</td>
                <td className="border p-2">{detail['Sample Type ']}</td>
                <td className="border p-2">{detail['Sample Received From']}</td>
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
                placeholder="Product Code"
                value={editDetail['Product code']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Product code': e.target.value })}
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
                value={editDetail['Expiry Date']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Expiry Date': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Quantity Received"
                value={editDetail['Qty. Received']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Qty. Received': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Received Date"
                value={editDetail['Received Date']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Received Date': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Invoice No"
                value={editDetail['Invoice no:']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Invoice no:': e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Invoice Date"
                value={editDetail['Invoice date ']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Invoice date ': e.target.value })}
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
                placeholder="Sample Received From"
                value={editDetail['Sample Received From']}
                onChange={(e) => setEditDetail({ ...editDetail, 'Sample Received From': e.target.value })}
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

export default IncomingDetails;
