import React from 'react';
import { Box, Button, Grid, TextField, InputAdornment, Checkbox, FormControlLabel } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useStore from '../store';
import RadioMenu from './common/RadioMenu'; 
import { useParams } from "react-router-dom";

interface Option {
  label: string;
  code: string;
}

interface FormData {
  petitionTitle: string;
  petitionDescription: string;
  categoryId: string;
  filetype: string;
  supportTier1Title: string;
  supportTier1Description: string;
  supportTier1Cost: string;
  supportTier1Id: number;
  supportTier2Title: string;
  supportTier2Description: string;
  supportTier2Cost: string;
  supportTier2Id: number;
  supportTier3Title: string;
  supportTier3Description: string;
  supportTier3Cost: string;
  supportTier3Id: number
  errors: {
    petitionTitle: string;
    petitionDescription: string;
    categoryId: string;
    filetype: string;
    supportTier1Title: string;
    supportTier1Description: string;
    supportTier1Cost: string;
    supportTier2Title: string;
    supportTier2Description: string;
    supportTier2Cost: string;
    supportTier3Title: string;
    supportTier3Description: string;
    supportTier3Cost: string;
  }
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});  

const Edit = () => {
  const { token } = useStore();
  const { id } = useParams(); 
  const navigate = useNavigate();
//   const [loading, setLoading] = React.useState(true);
//   const [currSupportTiers, setCurrSupportTiers] = React.useState<SupportTier[]>([]);

//   React.useEffect(() => {
//     const getPetition = () => {
//         axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
//             .then((response) => {
//                 setFormData(form => ({
//                     ...form,
//                     petitionTitle: response.data.title,
//                     petitionDescription: response.data.description,
//                     categoryId: response.data.categoryId.toString(),
//                     supportTier1Title: response.data.supportTiers[0]?.title || '',
//                     supportTier1Description: response.data.supportTiers[0]?.description || '',
//                     supportTier1Cost: response.data.supportTiers[0]?.cost?.toString() || '',
//                     supportTier1Id: response.data.supportTiers[0]?.supportTierId || '',
//                     supportTier2Title: response.data.supportTiers[1]?.title || '',
//                     supportTier2Description: response.data.supportTiers[1]?.description || '',
//                     supportTier2Cost: response.data.supportTiers[1]?.cost?.toString() || '',
//                     supportTier2Id: response.data.supportTiers[1]?.supportTierId || '',
//                     supportTier3Title: response.data.supportTiers[2]?.title || '',
//                     supportTier3Description: response.data.supportTiers[2]?.description || '',
//                     supportTier3Cost: response.data.supportTiers[2]?.cost?.toString() || '',
//                     supportTier3Id: response.data.supportTiers[2]?.supportTierId || ''
//                 }));
//                 setCurrSupportTiers(response.data.supportTiers)
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 setError(error.toString());
//                 setLoading(false);
//             })
//     };
//     getPetition();
//   }, [id]);

//   const [formData, setFormData] = React.useState<FormData>({
//     petitionTitle: '',
//     petitionDescription: '',
//     categoryId: '',
//     filetype: '',
//     supportTier1Title: '',
//     supportTier1Description: '',
//     supportTier1Cost: '',
//     supportTier1Id: 0,
//     supportTier2Title: '',
//     supportTier2Description: '',
//     supportTier2Cost: '',
//     supportTier2Id: 0,
//     supportTier3Title: '',
//     supportTier3Description: '',
//     supportTier3Cost: '',
//     supportTier3Id: 0,
//     errors: {
//       petitionTitle: '',
//       petitionDescription: '',
//       categoryId: '',
//       filetype: '',
//       supportTier1Title: '',
//       supportTier1Description: '',
//       supportTier1Cost: '',
//       supportTier2Title: '',
//       supportTier2Description: '',
//       supportTier2Cost: '',
//       supportTier3Title: '',
//       supportTier3Description: '',
//       supportTier3Cost: '',
//     }
//   });

//   const [file, setFile] = React.useState<File | null>(null);
//   const [error, setError] = React.useState("");
//   const [categories, setCategories] = React.useState<Option[]>([]);
//   const [loadingCategories, setLoadingCategories] = React.useState(true);
//   const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//   const [deleteTier1, setDeleteTier1] = React.useState(false);
//   const [deleteTier2, setDeleteTier2] = React.useState(false);
//   const [deleteTier3, setDeleteTier3] = React.useState(false);

// const handleDelBoxChange1 = () => {
//   setDeleteTier1(!deleteTier1);
// };

// const handleDelBoxChange2 = () => {
//     setDeleteTier2(!deleteTier2);
//   };

// const handleDelBoxChange3 = () => {
// setDeleteTier3(!deleteTier3);
// };

//   React.useEffect(() => {
//     const getCategories = () => {
//       axios.get('http://localhost:4941/api/v1/petitions/categories')
//         .then((response) => {
//           setCategories(response.data.map((cat: any) => ({ label: cat.name, code: cat.categoryId.toString() })));
//           setLoadingCategories(false);
//         })
//         .catch((error) => {
//           setError(error.toString());
//           setLoadingCategories(false); 
//         });
//     };
//     getCategories();
//   }, []);

//   const validate = () => {
//     let isValid = true;
//     const errors: FormData['errors'] = {
//       petitionTitle: '',
//       petitionDescription: '',
//       categoryId: '',
//       filetype: '',
//       supportTier1Title: '',
//       supportTier1Description: '',
//       supportTier1Cost: '',
//       supportTier2Title: '',
//       supportTier2Description: '',
//       supportTier2Cost: '',
//       supportTier3Title: '',
//       supportTier3Description: '',
//       supportTier3Cost: ''
//     };
  
//     // Validate main fields
//     if (!formData.petitionTitle) {
//       errors.petitionTitle = 'Enter a petition title';
//       isValid = false;
//     }
  
//     if (!formData.petitionDescription) {
//       errors.petitionDescription = 'Enter a description';
//       isValid = false;
//     }
  
//     if (!formData.categoryId) {
//       errors.categoryId = 'Select a category';
//       isValid = false;
//     }
  
//     if (file && !validFileTypes.includes(file.type)) {
//       errors.filetype = 'Upload a PNG, GIF or JPG image';
//       isValid = false;
//     }
  
//     // Validate support tiers
//     const seenTitles = new Set<string>();
//     const validateSupportTier = (title: string, description: string, cost: string, tierName: 'supportTier1' | 'supportTier2' | 'supportTier3') => {
//       const isAnyFieldFilled = title || description || cost;
//       const isComplete = title && description && cost;
  
//       if (isAnyFieldFilled && !isComplete) {
//         if (!title) errors[`${tierName}Title`] = 'Title is required';
//         if (!description) errors[`${tierName}Description`] = 'Description is required';
//         if (!cost) errors[`${tierName}Cost`] = 'Cost is required';
//         isValid = false;
//       }
  
//       if (title) {
//         if (seenTitles.has(title)) {
//           errors[`${tierName}Title`] = 'Support tier titles must be unique';
//           isValid = false;
//         } else {
//           seenTitles.add(title);
//         }
//       }
//     };
  
//     validateSupportTier(formData.supportTier1Title, formData.supportTier1Description, formData.supportTier1Cost, 'supportTier1');
//     validateSupportTier(formData.supportTier2Title, formData.supportTier2Description, formData.supportTier2Cost, 'supportTier2');
//     validateSupportTier(formData.supportTier3Title, formData.supportTier3Description, formData.supportTier3Cost, 'supportTier3');
    
//     let toDelete = 0;
//     if (deleteTier1) {toDelete++}
//     if (deleteTier2) {toDelete++}
//     if (deleteTier3) {toDelete++}
//     if (currSupportTiers.length - toDelete <= 0) {
//         setError('Petition must have one support tier')
//         isValid = false;
//     }
//     setFormData(form => ({ ...form, errors }));
//     return isValid;
//   };
//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData(form => ({ ...form, [name]: value }));
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//       setError("");
//     } else {
//       setFile(null);
//       setError("No file selected.");
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (validate()) {
//       try {
//         const supportTiers = [
//           {
//             title: formData.supportTier1Title,
//             description: formData.supportTier1Description,
//             cost: parseInt(formData.supportTier1Cost),
//           },
//           {
//             title: formData.supportTier2Title,
//             description: formData.supportTier2Description,
//             cost: parseInt(formData.supportTier2Cost),
//           },
//           {
//             title: formData.supportTier3Title,
//             description: formData.supportTier3Description,
//             cost: parseInt(formData.supportTier3Cost),
//             tier: 3
//           }
//         ].filter(tier => tier.title && tier.description && tier.cost);

//         if (supportTiers.length === 0) {
//           setFormData(form => ({
//             ...form,
//             errors: {
//               ...form.errors,
//               supportTier1Title: 'Petition must have at least one support tier'
//             }
//           }));
//           return;
//         }

//         const petition = {
//           title: formData.petitionTitle,
//           description: formData.petitionDescription,
//           categoryId: parseInt(formData.categoryId),
//         };

//         const response = await axios.patch(`http://localhost:4941/api/v1/petitions/${id}`, petition, {
//                                                                               headers: {
//                                                                                 "X-Authorization": token
//                                                                               },
//                                                                             });
        
//         const deleteTier = (supportTierId: number) => {
//             axios.delete(`http://localhost:4941/api/v1/petitions/${id}/supportTiers/${supportTierId}`, {
//                 headers: {
//                 "X-Authorization": token
//                     },
//                 })
//             .then((response) => {  
//                 })
//             .catch((error) => {
//             if (error.response.status === 403) {
//                 setError('Cannot delete a support tier with supporters');
//                 }
//             })
//         }

//         const updateTier = (supportTierId: number, tier: SupportTier) => {
//             axios.patch(`http://localhost:4941/api/v1/petitions/${id}/supportTiers/${supportTierId}`, tier, {
//                 headers: {
//                 "X-Authorization": token
//                     },
//                 })
//             .then((response) => {  
//                 })
//             .catch((error) => {
//             if (error.response.status === 403) {
//                 setError('Cannot edit a support tier with supporters');
//                 }
//             })
//         }

//         if (supportTiers[0] && currSupportTiers[0]) {
//             updateTier()
//         }

//         if (deleteTier1) {
//             deleteTier(formData.supportTier1Id)
//         }
//         if (deleteTier2) {
//             deleteTier(formData.supportTier2Id)
//         }
//         if (deleteTier3) {
//             deleteTier(formData.supportTier3Id)
//         }
       
//         if (file) {
//           await handleUpload(token);
//         }
//         if (!error) {
//             navigate("/account");
//         }
        
//       } catch (error: any) {
//         if (axios.isAxiosError(error) && error.response) {
//           if (error.response.status === 403) {
//             setFormData(form => ({
//               ...form,
//               errors: {
//                 ...form.errors,
//                 petitionTitle: 'Petition title already exists'
//               }
//             }));
//           }
//           setError(error.response.data.message || "An error occurred");
//         } else {
//           setError("An unknown error occurred");
//         }
//       }
//     }
//   };

//   const handleUpload = (token: string) => {
//     if (file) {
//       axios.put(
//         `http://localhost:4941/api/v1/petitions/${id}/image`,
//         file,
//         {
//           headers: {
//             "Content-Type": file.type,
//             "X-Authorization": token
//           },
//         }
//       )
//         .then((response) => {
//         })
//         .catch((error) => {
//           if (error.response && error.response.status === 400) {
//             setError("Invalid file type. Please try again.");
//           } else {
//             setError("Error occurred uploading petition image");
//           }
//         });
//     }
//   };

//   const handleCategoryChange = (value: string) => {
//     setFormData(form => ({ ...form, categoryId: value }));
//   };

//   if (!loading) {
//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         '& .MuiTextField-root': {
//           m: 2,
//           width: '45ch'
//         }
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       <div>
//         <div>
//           <h1>Edit Petition</h1>
//         </div>
//         <div>
//           <TextField
//             required
//             name="petitionTitle"
//             id="outlined-required"
//             label="Petition Title"
//             value={formData.petitionTitle}
//             onChange={handleChange}
//             error={!!formData.errors.petitionTitle}
//             helperText={formData.errors.petitionTitle}
//           />
//         </div>
//         <div>
//           <TextField
//             required
//             name="petitionDescription"
//             id="outlined-required"
//             multiline
//             rows={4}
//             label="Description"
//             value={formData.petitionDescription}
//             onChange={handleChange}
//             error={!!formData.errors.petitionDescription}
//             helperText={formData.errors.petitionDescription}
//           />
//         </div>
//         <div>
//           {loadingCategories ? (
//             <div>Loading categories...</div> 
//           ) : (
//             <RadioMenu
//               options={categories}
//               title="Change Category"
//               onInputChangeStr={handleCategoryChange}
//             />
//           )}
//           {formData.errors.categoryId && <div style={{ color: "red" }}>{formData.errors.categoryId}</div>}
//         </div>
//         <div style={{ margin: 10 }}>
//           <Button
//             component="label"
//             role={undefined}
//             variant="contained"
//             tabIndex={-1}
//             startIcon={<CloudUploadIcon />}>
//             Change Petition Photo
//             <VisuallyHiddenInput type="file" onChange={handleFileChange} />
//           </Button>
//           {file ? <p>{file.name}</p> : ""}
//           {formData.errors.filetype && <div style={{ color: "red", marginTop: "10px" }}>{formData.errors.filetype}</div>}
//         </div>
//       </div>
//       <Grid container spacing={2} justifyContent="center" paddingLeft='150px' paddingRight="150px">
//         <Grid item sm={12} lg={4}>
//           <h2>Support Tier 1</h2>
//           <TextField
//             name="supportTier1Title"
//             id="outlined-required"
//             label="Title"
//             value={formData.supportTier1Title}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier1Title}
//             helperText={formData.errors.supportTier1Title}
//             disabled={deleteTier1}
//             fullWidth
//           />
//           <TextField
//             name="supportTier1Description"
//             id="outlined-required"
//             multiline
//             rows={4}
//             label="Description"
//             value={formData.supportTier1Description}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier1Description}
//             helperText={formData.errors.supportTier1Description}
//             disabled={deleteTier1}
//             fullWidth
//           />
//           <TextField
//             name="supportTier1Cost"
//             id="outlined-required"
//             label="Cost"
//             type="number"
//             value={formData.supportTier1Cost}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier1Cost}
//             helperText={formData.errors.supportTier1Cost}
//             fullWidth
//             InputProps={{
//               startAdornment: <InputAdornment position="start">$</InputAdornment>,
//             }}
//             disabled={deleteTier1}
//           />
//              <div>
//                 {currSupportTiers[0]?.title  ? 
//                 <FormControlLabel control={<Checkbox onChange={handleDelBoxChange1} />} label="Delete Tier"/> :
//                 <FormControlLabel control={<Checkbox disabled />} label="Delete Tier"/>}
//             </div> 
    
//         </Grid>
//         <Grid item sm={12} lg={4}>
//           <h2>Support Tier 2</h2>
//           <TextField
//             name="supportTier2Title"
//             id="outlined-required"
//             label="Title"
//             value={formData.supportTier2Title}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier2Title}
//             helperText={formData.errors.supportTier2Title}
//             disabled={deleteTier2}
//             fullWidth
//           />
//           <TextField
//             name="supportTier2Description"
//             id="outlined-required"
//             multiline
//             rows={4}
//             label="Description"
//             value={formData.supportTier2Description}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier2Description}
//             helperText={formData.errors.supportTier2Description}
//             disabled={deleteTier2}
//             fullWidth
//           />
//           <TextField
//             name="supportTier2Cost"
//             id="outlined-required"
//             label="Cost"
//             type="number"
//             value={formData.supportTier2Cost}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier2Cost}
//             helperText={formData.errors.supportTier2Cost}
//             disabled={deleteTier2}
//             fullWidth
//             InputProps={{
//               startAdornment: <InputAdornment position="start">$</InputAdornment>,
//             }}
//           />
//             <div>
//                 {currSupportTiers[1]?.title ? 
//                 <FormControlLabel control={<Checkbox onChange={handleDelBoxChange2} />} label="Delete Tier"/> :
//                 <FormControlLabel control={<Checkbox disabled />} label="Delete Tier"/>}
//             </div> 
         
//         </Grid>
//         <Grid item sm={12} lg={4}>
//           <h2>Support Tier 3</h2>
//           <TextField
//             name="supportTier3Title"
//             id="outlined-required"
//             label="Title"
//             value={formData.supportTier3Title}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier3Title}
//             helperText={formData.errors.supportTier3Title}
//             disabled={deleteTier3}
//             fullWidth
//           />
//           <TextField
//             name="supportTier3Description"
//             id="outlined-required"
//             multiline
//             rows={4}
//             label="Description"
//             value={formData.supportTier3Description}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier3Description}
//             helperText={formData.errors.supportTier3Description}
//             disabled={deleteTier3}
//             fullWidth
//           />
//           <TextField
//             name="supportTier3Cost"
//             id="outlined-required"
//             label="Cost"
//             type="number"
//             value={formData.supportTier3Cost}
//             onChange={handleChange}
//             error={!!formData.errors.supportTier3Cost}
//             helperText={formData.errors.supportTier3Cost}
//             disabled={deleteTier3}
//             fullWidth
//             InputProps={{
//               startAdornment: <InputAdornment position="start">$</InputAdornment>,
//             }}
//           />
//             <div>
//                 {currSupportTiers[2]?.title  ? 
//                 <FormControlLabel control={<Checkbox onChange={handleDelBoxChange3} />} label="Delete Tier"/> :
//                 <FormControlLabel control={<Checkbox disabled />} label="Delete Tier"/>}
//             </div> 
         
//         </Grid>
//       </Grid>
//       {error ? 
//       <div style={{ color: 'red'}}>
//         {error}
//       </div> : ""}
//       <div >
//         <Button
//           sx={{ m: 2 }}
//           type="submit"
//           variant="contained"
//         >
//           Submit
//         </Button>
//       </div>

//     </Box>
//   );
//     }
//     return null;
};

export default Edit;