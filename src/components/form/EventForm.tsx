import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  Input,
  Typography,
  Button,
  Textarea,
  Select,
  Option,
  Switch,
} from "@material-tailwind/react";
import { createEvent, getCategories } from "../../api/event";
import { useEffect, useState } from "react";
import { AlertMessage, useAlertMessage } from '../form/AlertMessage';
//import { useNavigate } from "react-router-dom";

export default function EventForm() {
  // Define the Category type
  type Category = {
    id: number;
    name: string;
  };
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { alertState, showSuccess, showError, hideAlert } = useAlertMessage();
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetching categories...");
      try {
        const result = await getCategories();
        if (result.error) {
          showError("Impossible de charger les catégories");
        } else {
          setCategories(result);
        }
      } catch (err) {
        showError("Erreur lors du chargement des catégories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Modifier la gestion du changement d'image
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    formik.setFieldValue("image", file);
  
    // Créer une prévisualisation de l'image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      categoryId: "",
      startDate: "",
      endDate: "",
      address: "",
      city: "",
      postalCode: "",
      budget: "",
      numberPlace: "",
      image: null,
      isPublished: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Le nom de l'événement est obligatoire."),
      description: Yup.string().required("La description est obligatoire."),
      categoryId: Yup.string().required("La catégorie est obligatoire."),
      startDate: Yup.date()
        .required("La date et l'heure de début sont obligatoires.")
        .min(new Date(), "La date de début doit être dans le futur"),
      endDate: Yup.date()
        .required("La date et l'heure de fin sont obligatoires.")
        .min(
          Yup.ref('startDate'), 
          "La date de fin doit être après la date de début"
        ),
      address: Yup.string().required("L'adresse est obligatoire."),
      city: Yup.string().required("La ville est obligatoire."),
      postalCode: Yup.string()
        .matches(/^\d{5}$/, "Le code postal doit comporter exactement 5 chiffres.")
        .required("Le code postal est obligatoire."),
      budget: Yup.number().min(0, "Le budget doit être supérieur ou égal à 0."),
      numberPlace: Yup.number().min(1, "Le nombre de places doit être au moins 1").required("Le nombre de places est obligatoire."),
      isPublished: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      console.log("onSubmit exécuté");
      setIsLoading(true);

      // Vérification supplémentaire des dates
      /* const now = new Date();
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
    
      if (startDate < now) {
        showError("La date de début ne peut pas être dans le passé");
        setIsLoading(false);
        return;
      }
    
      if (endDate <= startDate) {
        showError("La date de fin doit être après la date de début");
        setIsLoading(false);
        return;
      } */

      try {
        const response = await createEvent({
          ...values,
          categoryId: Number(values.categoryId),
          budget: Number(values.budget),
          numberPlace: Number(values.numberPlace),
        });

        console.log("Response from createEvent:", response);

        if (response.error) {
          showError("Erreur lors de la création de l'événement");
        } else {
          showSuccess("Événement créé avec succès !");
          formik.resetForm();
          //navigate("/my-events");
        }
      } catch (err) {
        showError("Une erreur est survenue lors de la création");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <AlertMessage {...alertState} onClose={hideAlert} />
      <Card className="p-6 max-w-xl mx-auto">
        <Typography variant="h4" color="blue-gray" className="text-center mb-4">
          CRÉER UN ÉVÉNEMENT
        </Typography>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input id="name" label="Nom de l'événement" {...formik.getFieldProps("name")} />
          {formik.touched.name && formik.errors.name && <Typography color="red">{formik.errors.name}</Typography>}

          <Textarea id="description" label="Description" {...formik.getFieldProps("description")} />
          {formik.touched.description && formik.errors.description && <Typography color="red">{formik.errors.description}</Typography>}

          <Select
            id="categoryId"
            name="categoryId"
            label="Catégorie de l'événement"
            value={formik.values.categoryId}
            onChange={(value) => formik.handleChange({
              target: {
                name: "categoryId",
                value: value
              }
            })}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id.toString()}>
                {category.name}
              </Option>
            ))}
          </Select>
          {formik.touched.categoryId && formik.errors.categoryId && <Typography color="red">{formik.errors.categoryId}</Typography>}

          <Input 
            id="startDate" 
            type="datetime-local" 
            label="Date et heure de début" 
            min={getCurrentDateTime()}
            {...formik.getFieldProps("startDate")} 
          />
          {formik.touched.startDate && formik.errors.startDate && 
            <Typography color="red">{formik.errors.startDate}</Typography>
          }

          <Input 
            id="endDate" 
            type="datetime-local" 
            label="Date et heure de fin" 
            min={formik.values.startDate || getCurrentDateTime()}
            {...formik.getFieldProps("endDate")} 
          />
          {formik.touched.endDate && formik.errors.endDate && 
            <Typography color="red">{formik.errors.endDate}</Typography>
          }

          <Input id="address" label="Adresse" {...formik.getFieldProps("address")} />
          {formik.touched.address && formik.errors.address && <Typography color="red">{formik.errors.address}</Typography>}

          <Input id="postalCode" label="Code Postal" {...formik.getFieldProps("postalCode")} />
          {formik.touched.postalCode && formik.errors.postalCode && <Typography color="red">{formik.errors.postalCode}</Typography>}

          <Input id="city" label="Ville" {...formik.getFieldProps("city")} />
          {formik.touched.city && formik.errors.city && <Typography color="red">{formik.errors.city}</Typography>}

          <Input id="budget" label="Budget (€)" {...formik.getFieldProps("budget")} />
          {formik.touched.budget && formik.errors.budget && <Typography color="red">{formik.errors.budget}</Typography>}

          <Input id="numberPlace" label="Nombre de places" {...formik.getFieldProps("numberPlace")} />
          {formik.touched.numberPlace && formik.errors.numberPlace && <Typography color="red">{formik.errors.numberPlace}</Typography>}

          {/* Champ pour uploader l'image */}
          <Input
            id="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2">
              <Typography variant="small" className="mb-1">Aperçu de l'image:</Typography>
              <img 
                src={imagePreview} 
                alt="Aperçu" 
                className="max-h-40 rounded-md shadow-sm" 
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mb-6">
            <Switch
              id="isPublished"
              label="Publier l'événement"
              checked={formik.values.isPublished}
              onChange={(e) => formik.setFieldValue("isPublished", e.target.checked)}
            />
            <Typography variant="small" color="gray" className="flex items-center gap-1">
              {formik.values.isPublished ? "L'événement sera visible publiquement" : "L'événement restera en brouillon"}
            </Typography>
          </div>

          <Button type="submit" data-cy="event-button" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer l'Événement"}
          </Button>
        </form>
      </Card>
    </>
  );
}
