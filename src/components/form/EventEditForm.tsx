import { useEffect, useState } from "react";
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
import { getEventById, updateEvent, getCategories, toggleEventPublishing } from "../../api/event";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { AlertMessage, useAlertMessage } from '../form/AlertMessage';
import { isEventPassed } from "../../utils/dateUtils";

interface Category {
  id: number;
  name: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  postalCode: string;
  budget: number;
  numberPlace: number;
  categories: Category[];
  media: Array<{ img: string }>;
  isPublished: boolean;
  error?: string;
}

interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  postalCode: string;
  budget: string;
  numberPlace: string;
  image: File | null;
  isPublished: boolean;
}

export default function EventEditForm() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialEventValues, setInitialEventValues] = useState<FormValues | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const { alertState, showSuccess, showError, hideAlert } = useAlertMessage();

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      showError("ID de l'événement invalide.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await getEventById(Number(id));
        
        if ('error' in response) {
          showError("Erreur lors du chargement de l'événement");
          return;
        }

        const eventData = response as unknown as Event;
        const formattedStartDate = dayjs(eventData.startDate).format("YYYY-MM-DDTHH:mm");
        const formattedEndDate = dayjs(eventData.endDate).format("YYYY-MM-DDTHH:mm");

        setInitialEventValues({
          name: eventData.name,
          description: eventData.description,
          categoryId: eventData.categories[0]?.id.toString() || "",
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          address: eventData.address,
          city: eventData.city,
          postalCode: eventData.postalCode,
          budget: eventData.budget.toString(),
          numberPlace: eventData.numberPlace.toString(),
          image: null,
          isPublished: eventData.isPublished
        });

        if (eventData.media?.[0]?.img) {
          setCurrentImage(`http://localhost:3000/media/uploads/${eventData.media[0].img}`);
        }
      } catch (err) {
        showError("Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.error) {
          showError("Impossible de charger les catégories");
        } else {
          setCategories(result);
        }
      } catch (err) {
        showError("Erreur lors du chargement des catégories");
      }
    };

    fetchEvent();
    fetchCategories();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
  
    if (file) {
      if (!file.type.startsWith("image")) {
        showError("Veuillez sélectionner un fichier image valide.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5 Mo
        showError("La taille de l'image ne doit pas dépasser 5 Mo.");
        return;
      }
  
      if (formik) {
        formik.setFieldValue("image", file);
      }
        console.log("🚀 ~ handleImageChange ~ file:", file)
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Le nom de l'événement est obligatoire."),
    description: Yup.string().required("La description est obligatoire."),
    categoryId: Yup.string().required("La catégorie est obligatoire."),
    startDate: Yup.string().required("La date et l'heure de début sont obligatoires."),
    endDate: Yup.string().required("La date et l'heure de fin sont obligatoires."),
    address: Yup.string().required("L'adresse est obligatoire."),
    city: Yup.string().required("La ville est obligatoire."),
    postalCode: Yup.string()
      .matches(/^\d{5}$/, "Le code postal doit comporter exactement 5 chiffres.")
      .required("Le code postal est obligatoire."),
    budget: Yup.number().min(0, "Le budget doit être supérieur ou égal à 0."),
    numberPlace: Yup.number().min(1, "Le nombre de places doit être au moins 1").required(
      "Le nombre de places est obligatoire."
    ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialEventValues || {
      name: "",
      description: "",
      categoryId: "",
      startDate: "",
      endDate: "",
      address: "",
      city: "",
      postalCode: "",
      budget: "0",
      numberPlace: "0",
      image: null,
      isPublished: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("categoryId", values.categoryId);
        formData.append("startDate", values.startDate);
        formData.append("endDate", values.endDate);
        formData.append("address", values.address);
        formData.append("city", values.city);
        formData.append("postalCode", values.postalCode);
        formData.append("budget", values.budget);
        formData.append("numberPlace", values.numberPlace);
        formData.append("isPublished", String(values.isPublished));

        if (values.image) {
          formData.append("image", values.image);
        }

        const response = await updateEvent(Number(id), formData);
        if ('error' in response) {
          showError(response.error || "Une erreur s'est produite lors de la mise à jour.");
          return;
        }
        showSuccess("L'événement a été mis à jour avec succès.");
      } catch (err) {
        showError("Une erreur s'est produite lors de la soumission du formulaire.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePublishingToggle = async (checked: boolean) => {
    try {
      setIsPublishing(true);
      await toggleEventPublishing(Number(id), checked);
      showSuccess(checked ? "Événement publié avec succès" : "Événement dépublié avec succès");
      formik.setFieldValue("isPublished", checked);
    } catch (error) {
      showError("Erreur lors du changement du statut de publication");
      formik.setFieldValue("isPublished", !checked); // Retour à l'état précédent
    } finally {
      setIsPublishing(false);
    }
  };

  // Rendre le formulaire seulement après avoir récupéré les valeurs initiales
  if (!initialEventValues) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <AlertMessage {...alertState} onClose={hideAlert} />
      <Card className="mx-auto p-4" style={{ maxWidth: "800px" }}>
        {initialEventValues && isEventPassed(initialEventValues.endDate) && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Typography className="text-amber-800 text-center">
              Attention : Vous modifiez un événement passé
            </Typography>
          </div>
        )}
        <Typography variant="h4" color="blue-gray" className="mb-4">
          Modifier l'événement
        </Typography>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <Input
              size="lg"
              label="Nom de l'événement"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={formik.touched.name && !!formik.errors.name}
            />
          </div>
          <div className="mb-4">
            <Textarea
              size="lg"
              label="Description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              error={formik.touched.description && !!formik.errors.description}
            />
          </div>
          <div className="mb-4">
            <Select
              size="lg"
              label="Catégorie"
              name="categoryId"
              value={formik.values.categoryId}
              onChange={(e) => formik.setFieldValue("categoryId", e)}
              onBlur={formik.handleBlur}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id.toString()}>
                  {category.name}
                </Option>
              ))}
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <Typography variant="small" color="red" className="mt-2">
                {formik.errors.categoryId}
              </Typography>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="datetime-local"
              size="lg"
              label="Date de début"
              name="startDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startDate}
              error={formik.touched.startDate && !!formik.errors.startDate}
            />
          </div>
          <div className="mb-4">
            <Input
              type="datetime-local"
              size="lg"
              label="Date de fin"
              name="endDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.endDate}
              error={formik.touched.endDate && !!formik.errors.endDate}
            />
          </div>
          <div className="mb-4">
            <Input
              size="lg"
              label="Adresse"
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              error={formik.touched.address && !!formik.errors.address}
            />
          </div>
          <div className="mb-4">
            <Input
              size="lg"
              label="Ville"
              name="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              error={formik.touched.city && !!formik.errors.city}
            />
          </div>
          <div className="mb-4">
            <Input
              size="lg"
              label="Code postal"
              name="postalCode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.postalCode}
              error={formik.touched.postalCode && !!formik.errors.postalCode}
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              size="lg"
              label="Budget"
              name="budget"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.budget}
              error={formik.touched.budget && !!formik.errors.budget}
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              size="lg"
              label="Nombre de places"
              name="numberPlace"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.numberPlace}
              error={formik.touched.numberPlace && !!formik.errors.numberPlace}
            />
          </div>
          <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="mb-2">
              Image actuelle
            </Typography>
            {currentImage && (
              <img
                src={currentImage}
                alt="Image actuelle de l'événement"
                style={{ maxWidth: "200px", maxHeight: "200px", marginRight: "10px" }}
              />
            )}
          </div>
          <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="mb-2">
              Télécharger une nouvelle image
            </Typography>
            <Input 
              id="image" 
              type="file" 
              onChange={handleImageChange} 
              accept="image/*"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Aperçu de la nouvelle image"
                style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <Switch
              id="isPublished"
              label="Statut de publication"
              checked={formik.values.isPublished}
              onChange={(e) => handlePublishingToggle(e.target.checked)}
              disabled={isPublishing}
            />
            <Typography variant="small" color="gray" className="flex items-center gap-1">
              {isPublishing ? (
                "Modification du statut en cours..."
              ) : formik.values.isPublished ? (
                "Événement publié publiquement"
              ) : (
                "Événement en brouillon"
              )}
            </Typography>
          </div>
          <Button type="submit" variant="gradient" color="blue" className="mt-6" disabled={loading}>
            {loading ? "En cours..." : "Modifier l'événement"}
          </Button>
        </form>
      </Card>
    </>
  );
}
