import { useState, useEffect } from 'react';

const STORAGE_KEY = 'polling_student_name';

export const useStudentName = () => {
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    // Try to get name from sessionStorage (unique per tab)
    const savedName = sessionStorage.getItem(STORAGE_KEY);
    if (savedName) {
      setStudentName(savedName);
    }
  }, []);

  const saveName = (name) => {
    sessionStorage.setItem(STORAGE_KEY, name);
    setStudentName(name);
  };

  const clearName = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStudentName('');
  };

  return {
    studentName,
    saveName,
    clearName,
    hasName: !!studentName,
  };
};
