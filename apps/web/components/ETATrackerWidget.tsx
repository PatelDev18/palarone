"use client"
import React, { useEffect, useState } from 'react';

export function ETATrackerWidget({ shipId }: { shipId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/predictions/eta/${shipId}`)
      .then(res => res.json())
      .then(json => {
        if (json.prediction) setData(json.prediction);
      })
      .catch(console.error);
  }, [shipId]);

  if (!data) return <div className="p-4 text-xs text-gray-500">Loading ETA ML Model...</div>;

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-100 space-y-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-primary">ETA Predictor</h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{data.prediction_metadata?.model_id}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Original ETA</span>
            <span className="text-sm font-medium">{new Date(data.original_eta).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Provider ETA</span>
            <span className="text-sm font-medium text-blue-600">{new Date(data.provider_eta).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 font-bold">AI Predicted ETA</span>
            <span className="text-sm font-bold text-warning">{new Date(data.ai_predicted_eta).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Expected Delay</span>
            <span className="text-sm font-bold text-critical">+{data.expected_delay_hours} hours</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-primary">Risk Assessment</h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">High Risk</span>
          <span className="text-xs text-gray-500">Confidence: {data.prediction_metadata?.confidence * 100}%</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Primary factors:</p>
          <ul className="list-disc pl-4 space-y-1">
            {data.primary_factors?.map((factor: string, i: number) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
