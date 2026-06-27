import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';

const fmtRx = (v) => {
  if (v == null) return '—';
  const n = parseFloat(v);
  if (isNaN(n)) return '—';
  return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
};

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`${baseURL}/api/user/prescription/${user._id}`, { withCredentials: true })
      .then(res => { if (res.data.success) setPrescriptions(res.data.prescriptions || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <p className="text-center py-[8vw] md:py-[2vw] text-regularTextPhone md:text-regularText text-gray-500">
      Loading prescriptions…
    </p>
  );

  return (
    <div className="flex flex-col gap-[4vw] md:gap-[1vw]">
      <h2 className="font-dyeLine font-bold text-h3TextPhone md:text-h3Text">My Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p className="text-regularTextPhone md:text-regularText text-gray-500 py-[4vw] md:py-[1vw]">
          No prescriptions saved yet.
        </p>
      ) : (
        prescriptions.map((rx) => {
          const hasEyeData = rx.rightEye?.sphere != null || rx.leftEye?.sphere != null;
          const hasAdd = rx.rightEye?.add != null || rx.leftEye?.add != null;
          const isOpen = expanded === rx._id;

          return (
            <div key={rx._id} className="border border-gray-200 rounded-[3vw] md:rounded-[.75vw] overflow-hidden shadow-sm">
              {/* Header — always visible, click to expand */}
              <div
                className="flex items-center gap-[3vw] md:gap-[.75vw] px-[4vw] md:px-[1vw] py-[3vw] md:py-[.75vw] bg-gray-50 cursor-pointer select-none"
                onClick={() => setExpanded(isOpen ? null : rx._id)}
              >
                <div className="flex-1 flex flex-col gap-[1vw] md:gap-[.2vw]">
                  <div className="flex items-center gap-[2vw] md:gap-[.5vw] flex-wrap">
                    <p className="font-bold text-mediumTextPhone md:text-mediumText">{rx.prescriptionName}</p>
                    <span className={`text-[2.8vw] md:text-[.6vw] px-[2vw] md:px-[.5vw] py-[.5vw] md:py-[.1vw] rounded-full font-medium ${
                      rx.source === 'Image Upload' ? 'bg-blue-100 text-blue-700' :
                      rx.source === 'Imported'     ? 'bg-purple-100 text-purple-700' :
                                                     'bg-green-100 text-green-700'
                    }`}>
                      {rx.source || 'Manual Entry'}
                    </span>
                  </div>
                  <p className="text-smallTextPhone md:text-smallText text-gray-500">Date: {rx.prescriptionDate}</p>
                </div>
                <svg
                  className={`w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Detail panel */}
              {isOpen && (
                <div className="px-[4vw] md:px-[1vw] py-[4vw] md:py-[1vw] flex flex-col gap-[4vw] md:gap-[1vw] border-t border-gray-100">

                  {/* Prescription image */}
                  {rx.prescriptionImage && (
                    <div>
                      <p className="text-smallTextPhone md:text-smallText font-semibold text-gray-600 mb-[2vw] md:mb-[.5vw]">Prescription Image</p>
                      <img
                        src={rx.prescriptionImage}
                        alt="Prescription"
                        className="w-[44vw] md:w-[14vw] h-[30vw] md:h-[9vw] object-contain rounded-[2vw] md:rounded-[.5vw] border border-gray-200 bg-gray-50 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setImageModal(rx.prescriptionImage)}
                      />
                      <p className="text-[2.8vw] md:text-[.6vw] text-gray-400 mt-[1vw] md:mt-[.25vw]">Click image to enlarge</p>
                    </div>
                  )}

                  {/* Eye measurements table */}
                  {hasEyeData && (
                    <div className="overflow-x-auto">
                      <p className="text-smallTextPhone md:text-smallText font-semibold text-gray-600 mb-[2vw] md:mb-[.5vw]">Eye Measurements</p>
                      <table className="w-full text-smallTextPhone md:text-smallText border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500">
                            <th className="text-left px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium"></th>
                            <th className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium">SPH</th>
                            <th className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium">CYL</th>
                            <th className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium">AXIS</th>
                            {hasAdd && <th className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium">ADD</th>}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-100">
                            <td className="px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium text-gray-700">Right (OD)</td>
                            <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{fmtRx(rx.rightEye?.sphere)}</td>
                            <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{fmtRx(rx.rightEye?.cylinder)}</td>
                            <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{rx.rightEye?.axis ?? '—'}</td>
                            {hasAdd && <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{fmtRx(rx.rightEye?.add)}</td>}
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw] font-medium text-gray-700">Left (OS)</td>
                            <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{fmtRx(rx.leftEye?.sphere)}</td>
                            <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{fmtRx(rx.leftEye?.cylinder)}</td>
                            <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{rx.leftEye?.axis ?? '—'}</td>
                            {hasAdd && <td className="text-center px-[2vw] md:px-[.5vw] py-[1.5vw] md:py-[.375vw]">{fmtRx(rx.leftEye?.add)}</td>}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pupillary distance */}
                  {rx.pupillaryDistance?.main && (
                    <div>
                      <p className="text-smallTextPhone md:text-smallText font-semibold text-gray-600 mb-[1vw] md:mb-[.25vw]">Pupillary Distance (PD)</p>
                      <div className="flex gap-[4vw] md:gap-[1.5vw] text-smallTextPhone md:text-smallText text-gray-700">
                        <span>Main: <span className="font-medium">{rx.pupillaryDistance.main}</span></span>
                        {rx.pupillaryDistance.left  && <span>Left: <span className="font-medium">{rx.pupillaryDistance.left}</span></span>}
                        {rx.pupillaryDistance.right && <span>Right: <span className="font-medium">{rx.pupillaryDistance.right}</span></span>}
                      </div>
                    </div>
                  )}

                  {/* Other details */}
                  {rx.otherDetails && (
                    <div>
                      <p className="text-smallTextPhone md:text-smallText font-semibold text-gray-600 mb-[1vw] md:mb-[.25vw]">Other Details</p>
                      <p className="text-smallTextPhone md:text-smallText text-gray-700">{rx.otherDetails}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Full-size image modal */}
      {imageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setImageModal(null)}
        >
          <img
            src={imageModal}
            alt="Prescription"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-[2vw] md:rounded-[1vw]"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-[4vw] right-[4vw] md:top-[1.5vw] md:right-[1.5vw] w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw] flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full text-white text-[5vw] md:text-[1.25vw] transition-colors"
            onClick={() => setImageModal(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
