// src/pages/bans/CreateBanPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import BanForm from '../../components/bans/BanForm';
import Card from '../../components/common/Card';

const CreateBanPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create New Ban</h1>
        
        <Link to="/bans">
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Back to List
          </button>
        </Link>
      </div>
      
      <Card>
        <BanForm />
      </Card>
    </div>
  );
};

export default CreateBanPage;