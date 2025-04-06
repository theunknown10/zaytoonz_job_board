import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiBell, FiFileText, FiPlus, FiChevronDown, FiChevronUp, FiTrash2, FiEdit, FiDownload, FiArrowUp, FiArrowDown, FiX, FiLoader, FiSave, FiList, FiFolder, FiEdit2, FiEye } from 'react-icons/fi';
import SeekerSidebar from './SeekerSidebar';
import './Dashboard.css';
import './SeekerCVMaker.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SeekerCVMaker = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [expandedSections, setExpandedSections] = useState(['general', 'work', 'education']);
  const [addedSections, setAddedSections] = useState(['general', 'work', 'education']);
  const [availableSections, setAvailableSections] = useState([
    'skills',
    'languages',
    'summary',
    'certificates',
    'projects',
    'volunteering',
    'publications',
    'references',
    'additional'
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Saved CVs management
  const [savedCVs, setSavedCVs] = useState([]);
  const [currentCVId, setCurrentCVId] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [cvName, setCvName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCVModified, setIsCVModified] = useState(false);
  
  // Tab management
  const [activeTab, setActiveTab] = useState('create');
  
  // CV Data State
  const [cvData, setCvData] = useState({
    general: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      nationality: '',
      birthDate: '',
      gender: '',
    },
    work: [
      {
        id: 1,
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }
    ],
    education: [
      {
        id: 1,
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }
    ],
    skills: [
      {
        id: 1,
        name: '',
        level: 'intermediate'
      }
    ],
    languages: [
      {
        id: 1,
        language: '',
        proficiency: 'intermediate',
      }
    ],
    summary: '',
    certificates: [
      {
        id: 1,
        name: '',
        issuer: '',
        date: '',
        description: ''
      }
    ],
    projects: [
      {
        id: 1,
        title: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        url: ''
      }
    ],
    volunteering: [],
    publications: [],
    references: [],
    additional: '',
  });

  const cvRef = useRef(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load saved CVs from localStorage on component mount
  useEffect(() => {
    const loadedCVs = localStorage.getItem('savedCVs');
    if (loadedCVs) {
      setSavedCVs(JSON.parse(loadedCVs));
    }
  }, []);
  
  // Set up listener to track CV changes
  useEffect(() => {
    if (currentCVId) {
      setIsCVModified(true);
    }
  }, [cvData, addedSections]);

  // Update any CV data change handlers to mark CV as modified
  const handleDataChange = (updateFunction) => {
    updateFunction();
    setIsCVModified(true);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleSection = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
    setActiveSection(section);
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setCvData({
      ...cvData,
      general: {
        ...cvData.general,
        [name]: value
      }
    });
    setIsCVModified(true);
  };

  const handleWorkChange = (index, field, value) => {
    const updatedWork = [...cvData.work];
    updatedWork[index] = {
      ...updatedWork[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      work: updatedWork
    });
    setIsCVModified(true);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...cvData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      education: updatedEducation
    });
    setIsCVModified(true);
  };

  const addWorkExperience = () => {
    setCvData({
      ...cvData,
      work: [
        ...cvData.work,
        {
          id: Date.now(),
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        }
      ]
    });
    setIsCVModified(true);
  };

  const removeWorkExperience = (index) => {
    if (cvData.work.length > 1) {
      const updatedWork = [...cvData.work];
      updatedWork.splice(index, 1);
      setCvData({
        ...cvData,
        work: updatedWork
      });
      setIsCVModified(true);
    }
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        }
      ]
    });
    setIsCVModified(true);
  };

  const removeEducation = (index) => {
    if (cvData.education.length > 1) {
      const updatedEducation = [...cvData.education];
      updatedEducation.splice(index, 1);
      setCvData({
        ...cvData,
        education: updatedEducation
      });
      setIsCVModified(true);
    }
  };

  const addSection = (section) => {
    // Add to the list of added sections
    setAddedSections([...addedSections, section]);
    // Expand the section immediately
    setExpandedSections([...expandedSections, section]);
    // Remove from available sections
    setAvailableSections(availableSections.filter(s => s !== section));
    // Set as active
    setActiveSection(section);
    setIsCVModified(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSectionSelect = (section) => {
    addSection(section);
    setIsDropdownOpen(false);
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      skills: updatedSkills
    });
    setIsCVModified(true);
  };

  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [
        ...cvData.skills,
        {
          id: Date.now(),
          name: '',
          level: 'intermediate'
        }
      ]
    });
    setIsCVModified(true);
  };

  const removeSkill = (index) => {
    if (cvData.skills.length > 1) {
      const updatedSkills = [...cvData.skills];
      updatedSkills.splice(index, 1);
      setCvData({
        ...cvData,
        skills: updatedSkills
      });
      setIsCVModified(true);
    }
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...cvData.languages];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      languages: updatedLanguages
    });
    setIsCVModified(true);
  };

  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [
        ...cvData.languages,
        {
          id: Date.now(),
          language: '',
          proficiency: 'intermediate'
        }
      ]
    });
    setIsCVModified(true);
  };

  const removeLanguage = (index) => {
    if (cvData.languages.length > 1) {
      const updatedLanguages = [...cvData.languages];
      updatedLanguages.splice(index, 1);
      setCvData({
        ...cvData,
        languages: updatedLanguages
      });
      setIsCVModified(true);
    }
  };

  const handleSummaryChange = (value) => {
    setCvData({
      ...cvData,
      summary: value
    });
    setIsCVModified(true);
  };

  const handleCertificateChange = (index, field, value) => {
    const updatedCertificates = [...cvData.certificates];
    updatedCertificates[index] = {
      ...updatedCertificates[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      certificates: updatedCertificates
    });
    setIsCVModified(true);
  };

  const addCertificate = () => {
    setCvData({
      ...cvData,
      certificates: [
        ...cvData.certificates,
        {
          id: Date.now(),
          name: '',
          issuer: '',
          date: '',
          description: ''
        }
      ]
    });
    setIsCVModified(true);
  };

  const removeCertificate = (index) => {
    if (cvData.certificates.length > 1) {
      const updatedCertificates = [...cvData.certificates];
      updatedCertificates.splice(index, 1);
      setCvData({
        ...cvData,
        certificates: updatedCertificates
      });
      setIsCVModified(true);
    }
  };

  const handleAdditionalChange = (value) => {
    setCvData({
      ...cvData,
      additional: value
    });
    setIsCVModified(true);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...cvData.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    setCvData({
      ...cvData,
      projects: updatedProjects
    });
    setIsCVModified(true);
  };

  const addProject = () => {
    setCvData({
      ...cvData,
      projects: [
        ...cvData.projects,
        {
          id: Date.now(),
          title: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          url: ''
        }
      ]
    });
    setIsCVModified(true);
  };

  const removeProject = (index) => {
    if (cvData.projects.length > 1) {
      const updatedProjects = [...cvData.projects];
      updatedProjects.splice(index, 1);
      setCvData({
        ...cvData,
        projects: updatedProjects
      });
      setIsCVModified(true);
    }
  };

  // Add these new functions for section navigation
  const moveSection = (index, direction) => {
    // Create a copy of the sections array
    const newOrder = [...addedSections];
    
    // Calculate new position
    const newIndex = index + direction;
    
    // Check if the new position is valid
    if (newIndex < 0 || newIndex >= newOrder.length) {
      return; // Can't move outside bounds
    }
    
    // Swap positions
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    
    // Update state with new order
    setAddedSections(newOrder);
    setIsCVModified(true);
  };

  const removeSection = (sectionToRemove) => {
    // Don't allow removal of core sections
    if (['general', 'work', 'education'].includes(sectionToRemove)) {
      return;
    }
    
    // Remove from added sections
    setAddedSections(addedSections.filter(section => section !== sectionToRemove));
    
    // Remove from expanded sections if it's expanded
    if (expandedSections.includes(sectionToRemove)) {
      setExpandedSections(expandedSections.filter(section => section !== sectionToRemove));
    }
    
    // Add back to available sections
    setAvailableSections([...availableSections, sectionToRemove]);
    setIsCVModified(true);
  };

  // Function to handle CV export
  const handleExportCV = async () => {
    try {
      // Set loading state and show the modal
      setExportLoading(true);
      setIsExportModalOpen(true);
      
      // Ensure we have valid data
      if (!cvData.general.firstName || !cvData.general.lastName) {
        throw new Error('Please fill in at least your first and last name in the Personal Information section');
      }

      // Short delay to ensure modal appears
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a temporary div for the CV content
      const cvContent = document.createElement('div');
      cvContent.className = 'cv-export-container';
      document.body.appendChild(cvContent);
      
      // Create styles for the CV export
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .cv-export-container {
          width: 210mm;
          padding: 15mm;
          background: white;
          font-family: Arial, sans-serif;
          color: #333;
        }
        .cv-export-header {
          border-bottom: 2px solid #004d00;
          padding-bottom: 10mm;
          margin-bottom: 10mm;
        }
        .cv-export-name {
          font-size: 24pt;
          font-weight: bold;
          color: #004d00;
          margin-bottom: 5mm;
        }
        .cv-export-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 5mm;
          font-size: 10pt;
        }
        .cv-export-section {
          margin-bottom: 10mm;
        }
        .cv-export-section-title {
          font-size: 14pt;
          font-weight: bold;
          color: #004d00;
          border-bottom: 1px solid #ccc;
          padding-bottom: 2mm;
          margin-bottom: 5mm;
        }
        .cv-export-item {
          margin-bottom: 5mm;
        }
        .cv-export-item-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          margin-bottom: 2mm;
        }
        .cv-export-item-title {
          font-weight: bold;
        }
        .cv-export-item-subtitle {
          font-style: italic;
        }
        .cv-export-item-dates {
          font-size: 9pt;
          color: #666;
        }
        .cv-export-item-description {
          font-size: 10pt;
          margin-top: 2mm;
        }
        .cv-export-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 3mm;
        }
        .cv-export-skill {
          background: #f5f5f5;
          padding: 2mm 3mm;
          border-radius: 3mm;
          font-size: 9pt;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Generate content based on CV data
      let europassContent = '';
      
      // Header with personal info
      if (cvData.general) {
        const { firstName, lastName, email, phone, address } = cvData.general;
        europassContent += `
          <div class="cv-export-header">
            <div class="cv-export-name">${firstName || ''} ${lastName || ''}</div>
            <div class="cv-export-contact">
              ${email ? `<div>${email}</div>` : ''}
              ${phone ? `<div>${phone}</div>` : ''}
              ${address ? `<div>${address}</div>` : ''}
            </div>
          </div>
        `;
      }
      
      // Generate content for each section in the order they appear
      addedSections.forEach(section => {
        switch(section) {
          case 'summary':
            if (cvData.summary) {
              europassContent += `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Profile</div>
                  <div class="cv-export-item-description">${cvData.summary}</div>
                </div>
              `;
            }
            break;
            
          case 'work':
            if (cvData.work && cvData.work.length > 0) {
              let workContent = `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Work Experience</div>
              `;
              
              cvData.work.forEach(work => {
                const { position, company, location, startDate, endDate, current, description } = work;
                const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
                const formattedEndDate = current ? 'Present' : (endDate ? new Date(endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '');
                
                workContent += `
                  <div class="cv-export-item">
                    <div class="cv-export-item-header">
                      <div class="cv-export-item-title">${position || ''}</div>
                      <div class="cv-export-item-dates">${formattedStartDate} - ${formattedEndDate}</div>
                    </div>
                    <div class="cv-export-item-subtitle">${company || ''}${location ? `, ${location}` : ''}</div>
                    ${description ? `<div class="cv-export-item-description">${description}</div>` : ''}
                  </div>
                `;
              });
              
              workContent += `</div>`;
              europassContent += workContent;
            }
            break;
            
          case 'education':
            if (cvData.education && cvData.education.length > 0) {
              let educationContent = `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Education and Training</div>
              `;
              
              cvData.education.forEach(education => {
                const { degree, institution, location, startDate, endDate, description } = education;
                const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
                const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
                
                educationContent += `
                  <div class="cv-export-item">
                    <div class="cv-export-item-header">
                      <div class="cv-export-item-title">${degree}</div>
                      <div class="cv-export-item-dates">${formattedStartDate} - ${formattedEndDate}</div>
                    </div>
                    <div class="cv-export-item-subtitle">${institution}${location ? `, ${location}` : ''}</div>
                    ${description ? `<div class="cv-export-item-description">${description}</div>` : ''}
                  </div>
                `;
              });
              
              educationContent += `</div>`;
              europassContent += educationContent;
            }
            break;
            
          case 'skills':
            if (cvData.skills && cvData.skills.length > 0) {
              let skillsContent = `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Skills</div>
                  <div class="cv-export-skills">
              `;
              
              cvData.skills.forEach(skill => {
                if (skill.name) {
                  skillsContent += `
                    <div class="cv-export-skill">
                      ${skill.name} (${skill.level.charAt(0).toUpperCase() + skill.level.slice(1)})
                    </div>
                  `;
                }
              });
              
              skillsContent += `</div></div>`;
              europassContent += skillsContent;
            }
            break;
            
          case 'languages':
            if (cvData.languages && cvData.languages.length > 0) {
              let languagesContent = `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Languages</div>
                  <div class="cv-export-skills">
              `;
              
              cvData.languages.forEach(language => {
                if (language.language) {
                  const proficiencyMap = {
                    'beginner': 'A1/A2',
                    'intermediate': 'B1/B2',
                    'advanced': 'C1',
                    'native': 'C2/Native'
                  };
                  
                  languagesContent += `
                    <div class="cv-export-skill">
                      ${language.language} (${proficiencyMap[language.proficiency] || language.proficiency})
                    </div>
                  `;
                }
              });
              
              languagesContent += `</div></div>`;
              europassContent += languagesContent;
            }
            break;
            
          case 'certificates':
            if (cvData.certificates && cvData.certificates.length > 0) {
              let certificatesContent = `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Certificates & Courses</div>
              `;
              
              cvData.certificates.forEach(certificate => {
                const { name, issuer, date, description } = certificate;
                const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
                
                certificatesContent += `
                  <div class="cv-export-item">
                    <div class="cv-export-item-title">${name}</div>
                    <div class="cv-export-item-subtitle">${issuer}${formattedDate ? ` (${formattedDate})` : ''}</div>
                    ${description ? `<div class="cv-export-item-description">${description}</div>` : ''}
                  </div>
                `;
              });
              
              certificatesContent += `</div>`;
              europassContent += certificatesContent;
            }
            break;
            
          case 'projects':
            if (cvData.projects && cvData.projects.length > 0) {
              let projectsContent = `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Projects</div>
              `;
              
              cvData.projects.forEach(project => {
                const { title, role, startDate, endDate, description, url } = project;
                const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
                const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
                const dateRange = formattedStartDate || formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : '';
                
                projectsContent += `
                  <div class="cv-export-item">
                    <div class="cv-export-item-header">
                      <div class="cv-export-item-title">${title}</div>
                      ${dateRange ? `<div class="cv-export-item-dates">${dateRange}</div>` : ''}
                    </div>
                    ${role ? `<div class="cv-export-item-subtitle">${role}</div>` : ''}
                    ${description ? `<div class="cv-export-item-description">${description}</div>` : ''}
                    ${url ? `<div class="cv-export-item-description"><a href="${url}" target="_blank">${url}</a></div>` : ''}
                  </div>
                `;
              });
              
              projectsContent += `</div>`;
              europassContent += projectsContent;
            }
            break;
            
          case 'additional':
            if (cvData.additional) {
              europassContent += `
                <div class="cv-export-section">
                  <div class="cv-export-section-title">Additional Information</div>
                  <div class="cv-export-item-description">${cvData.additional.replace(/\n/g, '<br>')}</div>
                </div>
              `;
            }
            break;
            
          // Other sections can be added as needed
          default:
            break;
        }
      });
      
      // Set the content to the temporary div
      cvContent.innerHTML = europassContent;
      
      // Generate PDF from the temporary div
      console.log('Generating PDF from HTML content');
      const canvas = await html2canvas(cvContent, { 
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        onclone: (doc) => {
          // Make the cloned document visible during capture for debugging
          const clonedContent = doc.querySelector('.cv-export-container');
          if (clonedContent) {
            clonedContent.style.position = 'absolute';
            clonedContent.style.left = '0';
            clonedContent.style.top = '0';
            clonedContent.style.visibility = 'visible';
            console.log('Content cloned successfully');
          }
        }
      });
      
      console.log('Canvas generated, creating PDF');
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Generate filename based on user's name
      const { firstName, lastName } = cvData.general;
      const filename = `${firstName || 'CV'}_${lastName || 'Document'}_${new Date().toISOString().slice(0, 10)}.pdf`.replace(/\s+/g, '_');
      
      console.log('Saving PDF:', filename);
      // Save the PDF
      pdf.save(filename);
      
      // Clean up
      document.body.removeChild(cvContent);
      document.head.removeChild(styleElement);
      
      // Reset state
      setExportLoading(false);
      setIsExportModalOpen(false);
      
    } catch (error) {
      console.error('Error generating CV:', error);
      setExportLoading(false);
      setIsExportModalOpen(false);
      alert(`There was an error generating your CV: ${error.message || 'Unknown error'}`);
    }
  };

  // Function to save the current CV
  const handleSaveCV = () => {
    setIsSaveModalOpen(true);
  };
  
  // Function to save CV with the given name
  const saveCVWithName = () => {
    if (!cvName.trim()) {
      alert('Please enter a name for your CV');
      return;
    }
    
    const cvToSave = {
      id: currentCVId || Date.now(),
      name: cvName,
      date: new Date().toISOString(),
      data: cvData,
      sections: addedSections,
      availableSections: availableSections
    };
    
    let updatedCVs;
    
    if (currentCVId) {
      // Update existing CV
      updatedCVs = savedCVs.map(cv => 
        cv.id === currentCVId ? cvToSave : cv
      );
    } else {
      // Create new CV
      updatedCVs = [...savedCVs, cvToSave];
      setCurrentCVId(cvToSave.id);
    }
    
    setSavedCVs(updatedCVs);
    localStorage.setItem('savedCVs', JSON.stringify(updatedCVs));
    setIsSaveModalOpen(false);
    setIsCVModified(false);
    setActiveTab('saved'); // Switch to the saved CVs tab after saving
    alert('CV saved successfully!');
  };
  
  // Function to handle rename CV
  const handleRenameCV = (id, name) => {
    setRenameId(id);
    setCvName(name);
    setIsRenameModalOpen(true);
  };
  
  // Function to complete rename
  const completeRename = () => {
    if (!cvName.trim()) {
      alert('Please enter a name for your CV');
      return;
    }
    
    const updatedCVs = savedCVs.map(cv => 
      cv.id === renameId ? { ...cv, name: cvName } : cv
    );
    
    setSavedCVs(updatedCVs);
    localStorage.setItem('savedCVs', JSON.stringify(updatedCVs));
    setIsRenameModalOpen(false);
    
    // Update current CV name if renaming current CV
    if (currentCVId === renameId) {
      setCurrentCVId(renameId);
    }
  };
  
  // Function to load a saved CV
  const loadCV = (cv) => {
    if (isCVModified && activeTab === 'create') {
      if (!window.confirm('You have unsaved changes. Are you sure you want to load a different CV?')) {
        return;
      }
    }
    
    setCvData(cv.data);
    setAddedSections(cv.sections);
    setAvailableSections(cv.availableSections);
    setCurrentCVId(cv.id);
    setCvName(cv.name);
    setActiveTab('create');
    setIsCVModified(false);
  };
  
  // Function to delete a saved CV
  const deleteCV = (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      const updatedCVs = savedCVs.filter(cv => cv.id !== id);
      setSavedCVs(updatedCVs);
      localStorage.setItem('savedCVs', JSON.stringify(updatedCVs));
      
      if (currentCVId === id) {
        // If the current CV is deleted, reset to a new CV
        resetCV();
      }
    }
  };
  
  // Function to create a new CV
  const createNewCV = () => {
    if (isCVModified) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to create a new CV?')) {
        return;
      }
    }
    
    resetCV();
    setActiveTab('create');
  };
  
  // Function to reset CV to default state
  const resetCV = () => {
    setCvData({
      general: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        nationality: '',
        birthDate: '',
        gender: '',
      },
      work: [
        {
          id: 1,
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        }
      ],
      education: [
        {
          id: 1,
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        }
      ],
      skills: [
        {
          id: 1,
          name: '',
          level: 'intermediate'
        }
      ],
      languages: [
        {
          id: 1,
          language: '',
          proficiency: 'intermediate',
        }
      ],
      summary: '',
      certificates: [
        {
          id: 1,
          name: '',
          issuer: '',
          date: '',
          description: ''
        }
      ],
      projects: [
        {
          id: 1,
          title: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          url: ''
        }
      ],
      volunteering: [],
      publications: [],
      references: [],
      additional: '',
    });
    setAddedSections(['general', 'work', 'education']);
    setAvailableSections([
      'skills',
      'languages',
      'summary',
      'certificates',
      'projects',
      'volunteering',
      'publications',
      'references',
      'additional'
    ]);
    setCurrentCVId(null);
    setCvName('');
    setIsCVModified(false);
  };

  // Function to export a specific CV
  const exportSpecificCV = async (cv) => {
    try {
      // Store current state
      const currentState = {
        cvData: {...cvData},
        addedSections: [...addedSections],
        availableSections: [...availableSections],
        currentCVId: currentCVId,
        cvName: cvName
      };
      
      // Temporarily set the CV to export
      setCvData(cv.data);
      setAddedSections(cv.sections);
      setAvailableSections(cv.availableSections);
      
      // Set loading state and show the modal
      setExportLoading(true);
      setIsExportModalOpen(true);
      
      // Short delay to ensure state update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate PDF
      await handleExportCV();
      
      // Restore previous state
      setCvData(currentState.cvData);
      setAddedSections(currentState.addedSections);
      setAvailableSections(currentState.availableSections);
      setCurrentCVId(currentState.currentCVId);
      setCvName(currentState.cvName);
      
    } catch (error) {
      console.error('Error exporting specific CV:', error);
      setExportLoading(false);
      setIsExportModalOpen(false);
      alert(`Error exporting CV: ${error.message || 'Unknown error'}`);
    }
  };

  // Function to render the Create CV tab
  const renderCreateTab = () => {
    return (
      <>
        <div className="dashboard-welcome">
          <h2>Build Your Professional CV</h2>
          <p>
            Create a standout CV in the Europass format that highlights your skills, experience, and qualifications.
            Fill in each section below to build your professional CV. Sections with * contain required fields.
          </p>
          {isCVModified && currentCVId && (
            <div className="cv-modified-alert">
              <FiEdit /> You have unsaved changes. Don't forget to save your CV!
            </div>
          )}
        </div>
        
        <div className="cv-builder" ref={cvRef}>
          <div className="cv-sections">
            {/* All sections that have been added to CV */}
            {addedSections.map((section, index) => (
              <div 
                key={section} 
                className={`cv-section ${expandedSections.includes(section) ? 'expanded' : ''} ${activeSection === section ? 'active' : ''}`}
              >
                <div className="cv-section-header">
                  <div className="section-title" onClick={() => toggleSection(section)}>
                    <h3>{getSectionTitle(section)}</h3>
                    {expandedSections.includes(section) ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  <div className="section-actions">
                    {index > 0 && (
                      <button 
                        className="action-button move-up" 
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, -1);
                        }}
                        title="Move section up"
                      >
                        <FiArrowUp />
                      </button>
                    )}
                    {index < addedSections.length - 1 && (
                      <button 
                        className="action-button move-down" 
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, 1);
                        }}
                        title="Move section down"
                      >
                        <FiArrowDown />
                      </button>
                    )}
                    {!['general', 'work', 'education'].includes(section) && (
                      <button 
                        className="action-button remove-section" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section);
                        }}
                        title="Remove section"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
                {expandedSections.includes(section) && renderSectionContent(section)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Add section button moved completely outside the CV builder container */}
        {availableSections.length > 0 && (
          <div className="add-section-outer-container">
            <div className="action-buttons-container">
              <div ref={dropdownRef} className="dropdown-wrapper">
                <button 
                  className="cv-action-button"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <FiPlus /> Add Section
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-content show">
                    {availableSections.map(section => (
                      <button 
                        key={section} 
                        className="dropdown-item"
                        onClick={() => handleSectionSelect(section)}
                      >
                        {getSectionTitle(section)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                className="cv-action-button"
                onClick={handleExportCV}
                title="Export your CV as PDF"
                disabled={exportLoading}
              >
                <FiDownload /> Export CV
              </button>
              
              <button 
                className="cv-action-button"
                onClick={handleSaveCV}
                title={currentCVId ? "Update CV" : "Save CV"}
              >
                <FiSave /> {currentCVId ? "Update CV" : "Save CV"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  // Function to render the My CVs tab
  const renderSavedCVsTab = () => {
    return (
      <div className="saved-cvs-container">
        <div className="dashboard-welcome">
          <h2>My Saved CVs</h2>
          <p>
            View and manage all your saved CVs. You can edit, rename, delete, or export any of your saved CVs.
          </p>
        </div>
        
        <div className="cv-list-container">
          {savedCVs.length === 0 ? (
            <div className="no-cvs-message">
              <FiFolder className="folder-icon" />
              <p>You don't have any saved CVs yet.</p>
              <button 
                className="cv-action-button new-cv-button"
                onClick={() => {
                  resetCV();
                  setActiveTab('create');
                }}
              >
                <FiPlus /> Create Your First CV
              </button>
            </div>
          ) : (
            <>
              <div className="cv-grid">
                {savedCVs.map(cv => (
                  <div key={cv.id} className={`cv-card ${currentCVId === cv.id ? 'active' : ''}`}>
                    <div className="cv-card-header">
                      <div className="cv-card-icon">
                        <FiFileText />
                      </div>
                      <div className="cv-card-title">
                        <h4>{cv.name}</h4>
                        <p>Last edited: {new Date(cv.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="cv-card-actions">
                      <button 
                        className="card-action-button"
                        onClick={() => loadCV(cv)}
                        title="Edit CV"
                      >
                        <FiEdit2 />
                        <span>Edit</span>
                      </button>
                      <button 
                        className="card-action-button"
                        onClick={() => handleRenameCV(cv.id, cv.name)}
                        title="Rename CV"
                      >
                        <FiEdit />
                        <span>Rename</span>
                      </button>
                      <button 
                        className="card-action-button"
                        onClick={() => exportSpecificCV(cv)}
                        title="Export CV"
                        disabled={exportLoading}
                      >
                        <FiDownload />
                        <span>Download</span>
                      </button>
                      <button 
                        className="card-action-button delete"
                        onClick={() => deleteCV(cv.id)}
                        title="Delete CV"
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cv-actions">
                <button 
                  className="cv-action-button"
                  onClick={() => {
                    resetCV();
                    setActiveTab('create');
                  }}
                >
                  <FiPlus /> Create New CV
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderGeneralSection = () => {
    return (
      <div className="cv-section-content">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={cvData.general.firstName}
              onChange={handleGeneralChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={cvData.general.lastName}
              onChange={handleGeneralChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={cvData.general.email}
              onChange={handleGeneralChange}
              placeholder="Email Address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={cvData.general.phone}
              onChange={handleGeneralChange}
              placeholder="Phone Number"
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label htmlFor="address">Address (Optional)</label>
          <input
            type="text"
            id="address"
            name="address"
            value={cvData.general.address}
            onChange={handleGeneralChange}
            placeholder="Address"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nationality">Nationality (Optional)</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={cvData.general.nationality}
              onChange={handleGeneralChange}
              placeholder="Nationality"
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Date of Birth (Optional)</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={cvData.general.birthDate}
              onChange={handleGeneralChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender (Optional)</label>
          <select
            id="gender"
            name="gender"
            value={cvData.general.gender}
            onChange={handleGeneralChange}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    );
  };

  const renderWorkSection = () => {
    return (
      <div className="cv-section-content">
        {cvData.work.map((work, index) => (
          <div key={work.id} className="work-item">
            {index > 0 && <div className="section-divider"></div>}
            <div className="item-header">
              <h4>Work Experience {index + 1}</h4>
              {cvData.work.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeWorkExperience(index)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`position-${index}`}>Job Title*</label>
                <input
                  type="text"
                  id={`position-${index}`}
                  value={work.position}
                  onChange={(e) => handleWorkChange(index, 'position', e.target.value)}
                  placeholder="Job Title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`company-${index}`}>Company*</label>
                <input
                  type="text"
                  id={`company-${index}`}
                  value={work.company}
                  onChange={(e) => handleWorkChange(index, 'company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={`location-${index}`}>Location</label>
              <input
                type="text"
                id={`location-${index}`}
                value={work.location}
                onChange={(e) => handleWorkChange(index, 'location', e.target.value)}
                placeholder="Location"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`startDate-${index}`}>Start Date*</label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  value={work.startDate}
                  onChange={(e) => handleWorkChange(index, 'startDate', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`endDate-${index}`}>End Date*</label>
                <input
                  type="date"
                  id={`endDate-${index}`}
                  value={work.endDate}
                  onChange={(e) => handleWorkChange(index, 'endDate', e.target.value)}
                  disabled={work.current}
                  required={!work.current}
                />
              </div>
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={work.current}
                  onChange={(e) => handleWorkChange(index, 'current', e.target.checked)}
                />
                I currently work here
              </label>
            </div>
            <div className="form-group full-width">
              <label htmlFor={`description-${index}`}>Key Responsibilities & Achievements</label>
              <textarea
                id={`description-${index}`}
                value={work.description}
                onChange={(e) => handleWorkChange(index, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements"
                rows="4"
              ></textarea>
            </div>
          </div>
        ))}
        <button type="button" className="add-item-button" onClick={addWorkExperience}>
          <FiPlus /> Add Another Work Experience
        </button>
      </div>
    );
  };

  const renderEducationSection = () => {
    return (
      <div className="cv-section-content">
        {cvData.education.map((edu, index) => (
          <div key={edu.id} className="education-item">
            {index > 0 && <div className="section-divider"></div>}
            <div className="item-header">
              <h4>Education {index + 1}</h4>
              {cvData.education.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeEducation(index)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`degree-${index}`}>Degree / Qualification*</label>
                <input
                  type="text"
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`institution-${index}`}>Institution*</label>
                <input
                  type="text"
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="School or University Name"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={`location-${index}`}>Location</label>
              <input
                type="text"
                id={`location-${index}`}
                value={edu.location}
                onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                placeholder="Location"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`startDate-${index}`}>Start Date*</label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`endDate-${index}`}>End Date (or Expected)</label>
                <input
                  type="date"
                  id={`endDate-${index}`}
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor={`description-${index}`}>Key Subjects & Achievements</label>
              <textarea
                id={`description-${index}`}
                value={edu.description}
                onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                placeholder="Describe your major subjects and achievements"
                rows="4"
              ></textarea>
            </div>
          </div>
        ))}
        <button type="button" className="add-item-button" onClick={addEducation}>
          <FiPlus /> Add Another Education
        </button>
      </div>
    );
  };

  const renderSkillsSection = () => {
    const skillLevels = [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'expert', label: 'Expert' }
    ];
    
    return (
      <div className="cv-section-content">
        <p className="section-description">
          List your professional skills and rate your proficiency level for each.
        </p>
        
        {cvData.skills.map((skill, index) => (
          <div key={skill.id} className="skill-item">
            {index > 0 && <div className="section-divider"></div>}
            <div className="item-header">
              <h4>Skill {index + 1}</h4>
              {cvData.skills.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeSkill(index)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`skill-name-${index}`}>Skill Name*</label>
                <input
                  type="text"
                  id={`skill-name-${index}`}
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  placeholder="e.g. Project Management, JavaScript, Photoshop"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`skill-level-${index}`}>Proficiency Level*</label>
                <select
                  id={`skill-level-${index}`}
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  required
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        
        <button type="button" className="add-item-button" onClick={addSkill}>
          <FiPlus /> Add Another Skill
        </button>
      </div>
    );
  };

  const renderLanguagesSection = () => {
    const proficiencyLevels = [
      { value: 'beginner', label: 'Basic (A1/A2)' },
      { value: 'intermediate', label: 'Independent (B1/B2)' },
      { value: 'advanced', label: 'Proficient (C1)' },
      { value: 'native', label: 'Native/Fluent (C2)' }
    ];
    
    return (
      <div className="cv-section-content">
        <p className="section-description">
          List languages you speak and your proficiency level for each using CEFR scale (A1-C2).
        </p>
        
        {cvData.languages.map((lang, index) => (
          <div key={lang.id} className="language-item">
            {index > 0 && <div className="section-divider"></div>}
            <div className="item-header">
              <h4>Language {index + 1}</h4>
              {cvData.languages.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeLanguage(index)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`language-name-${index}`}>Language*</label>
                <input
                  type="text"
                  id={`language-name-${index}`}
                  value={lang.language}
                  onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  placeholder="e.g. English, French, Spanish"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`language-level-${index}`}>Proficiency Level*</label>
                <select
                  id={`language-level-${index}`}
                  value={lang.proficiency}
                  onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                  required
                >
                  {proficiencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        
        <button type="button" className="add-item-button" onClick={addLanguage}>
          <FiPlus /> Add Another Language
        </button>
      </div>
    );
  };

  const renderSummarySection = () => {
    return (
      <div className="cv-section-content">
        <p className="section-description">
          Write a brief professional summary highlighting your key qualifications, experience, and career objectives.
          This will appear at the top of your CV and make a strong first impression.
        </p>
        
        <div className="form-group full-width">
          <label htmlFor="summary">Professional Summary</label>
          <textarea
            id="summary"
            value={cvData.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            placeholder="Example: Experienced marketing professional with 5+ years in digital marketing and brand development. Skilled in SEO, content strategy, and campaign management with a proven track record of increasing online engagement by 150% and managing successful product launches. Seeking to leverage my expertise in a senior marketing role."
            rows="6"
          ></textarea>
          <div className="field-tip">
            Keep your summary concise (3-5 sentences) and focused on your most relevant qualifications for the job you're targeting.
          </div>
        </div>
      </div>
    );
  };

  const renderCertificatesSection = () => {
    return (
      <div className="cv-section-content">
        <p className="section-description">
          List relevant certifications, courses, and professional development activities you've completed.
        </p>
        
        {cvData.certificates.map((cert, index) => (
          <div key={cert.id} className="certificate-item">
            {index > 0 && <div className="section-divider"></div>}
            <div className="item-header">
              <h4>Certificate/Course {index + 1}</h4>
              {cvData.certificates.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeCertificate(index)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`certificate-name-${index}`}>Certificate/Course Name*</label>
                <input
                  type="text"
                  id={`certificate-name-${index}`}
                  value={cert.name}
                  onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                  placeholder="e.g. Certified Project Manager (PMP)"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`certificate-issuer-${index}`}>Issuing Organization*</label>
                <input
                  type="text"
                  id={`certificate-issuer-${index}`}
                  value={cert.issuer}
                  onChange={(e) => handleCertificateChange(index, 'issuer', e.target.value)}
                  placeholder="e.g. Project Management Institute"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={`certificate-date-${index}`}>Date Obtained</label>
              <input
                type="date"
                id={`certificate-date-${index}`}
                value={cert.date}
                onChange={(e) => handleCertificateChange(index, 'date', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor={`certificate-description-${index}`}>Description (Optional)</label>
              <textarea
                id={`certificate-description-${index}`}
                value={cert.description}
                onChange={(e) => handleCertificateChange(index, 'description', e.target.value)}
                placeholder="Describe what you learned or the skills you gained"
                rows="3"
              ></textarea>
            </div>
          </div>
        ))}
        
        <button type="button" className="add-item-button" onClick={addCertificate}>
          <FiPlus /> Add Another Certificate or Course
        </button>
      </div>
    );
  };

  const renderProjectsSection = () => {
    return (
      <div className="cv-section-content">
        <p className="section-description">
          List significant projects that showcase your skills and expertise. These can include personal projects, 
          academic work, open-source contributions, or professional projects.
        </p>
        
        {cvData.projects.map((project, index) => (
          <div key={project.id} className="project-item">
            {index > 0 && <div className="section-divider"></div>}
            <div className="item-header">
              <h4>Project {index + 1}</h4>
              {cvData.projects.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeProject(index)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`project-title-${index}`}>Project Title*</label>
                <input
                  type="text"
                  id={`project-title-${index}`}
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  placeholder="e.g. E-commerce Website, Research Paper"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`project-role-${index}`}>Your Role</label>
                <input
                  type="text"
                  id={`project-role-${index}`}
                  value={project.role}
                  onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                  placeholder="e.g. Lead Developer, Researcher"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`project-start-${index}`}>Start Date</label>
                <input
                  type="date"
                  id={`project-start-${index}`}
                  value={project.startDate}
                  onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor={`project-end-${index}`}>End Date</label>
                <input
                  type="date"
                  id={`project-end-${index}`}
                  value={project.endDate}
                  onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor={`project-url-${index}`}>Project URL (Optional)</label>
              <input
                type="url"
                id={`project-url-${index}`}
                value={project.url}
                onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor={`project-description-${index}`}>Description*</label>
              <textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                placeholder="Describe the project, your responsibilities, technologies used, and outcomes achieved."
                rows="4"
                required
              ></textarea>
            </div>
          </div>
        ))}
        
        <button type="button" className="add-item-button" onClick={addProject}>
          <FiPlus /> Add Another Project
        </button>
      </div>
    );
  };

  const renderAdditionalSection = () => {
    return (
      <div className="cv-section-content">
        <div className="form-group full-width">
          <label htmlFor="additional">Additional Information</label>
          <textarea
            id="additional"
            value={cvData.additional}
            onChange={(e) => handleAdditionalChange(e.target.value)}
            placeholder="Examples:&#10;• Driving License: Full, clean license&#10;• Interests: Mountain climbing, photography, volunteering at local animal shelter&#10;• Awards: Employee of the Year 2022, Dean's List 2018-2020&#10;• Professional Memberships: Member of the Institute of Electrical and Electronics Engineers (IEEE)"
            rows="6"
          ></textarea>
          <div className="field-tip">
            Focus on information that adds value to your professional profile or demonstrates relevant qualities.
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholderSection = (sectionTitle) => {
    return (
      <div className="cv-section-content coming-soon">
        <FiFileText className="placeholder-icon" />
        <h3>Coming Soon</h3>
        <p>The {sectionTitle} section will be available soon!</p>
      </div>
    );
  };

  const renderSectionContent = (section) => {
    switch (section) {
      case 'general':
        return renderGeneralSection();
      case 'work':
        return renderWorkSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'languages':
        return renderLanguagesSection();
      case 'summary':
        return renderSummarySection();
      case 'certificates':
        return renderCertificatesSection();
      case 'projects':
        return renderProjectsSection();
      case 'additional':
        return renderAdditionalSection();
      default:
        return renderPlaceholderSection(section.charAt(0).toUpperCase() + section.slice(1));
    }
  };

  const getSectionTitle = (section) => {
    const titles = {
      general: 'Personal Information',
      work: 'Work Experience',
      education: 'Education and Training',
      skills: 'Skills',
      languages: 'Language Skills',
      summary: 'Profile Summary',
      certificates: 'Certificates & Courses',
      projects: 'Projects',
      volunteering: 'Volunteering Experience',
      publications: 'Publications',
      references: 'References',
      additional: 'Additional Information'
    };
    return titles[section] || section;
  };

  return (
    <div className="seeker-layout">
      <SeekerSidebar className={isMobileSidebarOpen ? 'open' : ''} />
      
      <div className="seeker-main">
        {isExportModalOpen && (
          <div className="export-modal-backdrop">
            <div className="export-modal">
              <div className="export-modal-content">
                <div className="export-loader">
                  <FiLoader className="spinner" />
                </div>
                <h3>CV is being generated thank you for waiting</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* Save CV Modal */}
        {isSaveModalOpen && (
          <div className="modal-backdrop">
            <div className="cv-modal">
              <div className="modal-header">
                <h3>{currentCVId ? 'Update CV' : 'Save CV'}</h3>
                <button 
                  className="close-button" 
                  onClick={() => setIsSaveModalOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="cv-name">CV Name</label>
                  <input
                    id="cv-name"
                    type="text"
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                    placeholder="My Professional CV"
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-button" 
                  onClick={() => setIsSaveModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-button" 
                  onClick={saveCVWithName}
                >
                  {currentCVId ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Rename CV Modal */}
        {isRenameModalOpen && (
          <div className="modal-backdrop">
            <div className="cv-modal">
              <div className="modal-header">
                <h3>Rename CV</h3>
                <button 
                  className="close-button" 
                  onClick={() => setIsRenameModalOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="cv-rename">New CV Name</label>
                  <input
                    id="cv-rename"
                    type="text"
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                    placeholder="Enter a new name for your CV"
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-button" 
                  onClick={() => setIsRenameModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-button" 
                  onClick={completeRename}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
        
        <header className="seeker-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FiMenu />
          </button>
          <h1>CV Maker {cvName && activeTab === 'create' ? `- ${cvName}` : ''}</h1>
          <div className="header-actions">
            {activeTab === 'create' && (
              <>
                <button 
                  className="action-button save-cv"
                  onClick={handleSaveCV}
                  title={currentCVId ? "Update CV" : "Save CV"}
                >
                  <FiSave /> {currentCVId ? "Update CV" : "Save CV"}
                </button>
                <button 
                  className="action-button download-cv"
                  onClick={handleExportCV}
                  disabled={exportLoading}
                >
                  <FiDownload /> Export CV
                </button>
              </>
            )}
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          {/* Tab Navigation */}
          <div className="cv-tabs">
            <button 
              className={`cv-tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => {
                if (isCVModified && !window.confirm('You have unsaved changes. Are you sure you want to switch tabs?')) {
                  return;
                }
                setActiveTab('create');
              }}
            >
              <FiEdit /> Create CV
            </button>
            <button 
              className={`cv-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <FiList /> My CVs
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="cv-tab-content">
            {activeTab === 'create' ? renderCreateTab() : renderSavedCVsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerCVMaker; 