import { useState } from "react";
import { toast } from "sonner";

export function TraceabilityStepForm({ productId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    stepType: "",
    description: "",
    location: "",
    certification: "",
    metadata: {
      temperature: "",
      humidity: "",
      quality_score: "",
      inspector: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const stepTypes = [
    { value: "farming", label: "🌱 Farming", desc: "Agricultural production and harvesting" },
    { value: "processing", label: "⚙️ Processing", desc: "Manufacturing and processing" },
    { value: "packaging", label: "📦 Packaging", desc: "Product packaging and labeling" },
    { value: "shipping", label: "🚚 Shipping", desc: "Transportation and logistics" },
    { value: "retail", label: "🏪 Retail", desc: "Retail distribution and sales" },
    { value: "quality_check", label: "✅ Quality Check", desc: "Quality assurance and testing" },
    { value: "certification", label: "📜 Certification", desc: "Compliance and certification" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleanMetadata = {};
      Object.keys(formData.metadata).forEach(key => {
        if (formData.metadata[key] !== null && formData.metadata[key].toString().trim() !== '') {
          if (key === 'quality_score') {
            const score = parseFloat(formData.metadata[key]);
            if (!isNaN(score)) {
              cleanMetadata[key] = score;
            }
          } else {
            cleanMetadata[key] = formData.metadata[key].trim();
          }
        }
      });

      const stepData = {
        stepType: formData.stepType,
        description: formData.description,
        location: formData.location,
        ...(formData.certification.trim() && { certification: formData.certification.trim() }),
        ...(Object.keys(cleanMetadata).length > 0 && { metadata: cleanMetadata }),
      };

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/${productId}/steps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(stepData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add traceability step");
      }

      toast.success("Traceability step added successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add step: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metadata.')) {
      const metadataKey = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          [metadataKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Traceability Step</h2>
          <p className="text-gray-600 mt-1">Record a new step in the product journey</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Step Type *
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {stepTypes.map((type) => (
              <label
                key={type.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  formData.stepType === type.value
                    ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="stepType"
                  value={type.value}
                  checked={formData.stepType === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what happened in this step..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter location (e.g., Farm ABC, Processing Plant XYZ)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certification (Optional)
          </label>
          <input
            type="text"
            name="certification"
            value={formData.certification}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter certification details"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Information (Optional)
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Temperature
              </label>
              <input
                type="text"
                name="metadata.temperature"
                value={formData.metadata.temperature}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="e.g., 2-4°C"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Humidity
              </label>
              <input
                type="text"
                name="metadata.humidity"
                value={formData.metadata.humidity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="e.g., 60-70%"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Quality Score (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                name="metadata.quality_score"
                value={formData.metadata.quality_score}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="e.g., 8.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Inspector
              </label>
              <input
                type="text"
                name="metadata.inspector"
                value={formData.metadata.inspector}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Inspector name"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.stepType || !formData.description || !formData.location}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Step...
              </div>
            ) : (
              "Add Step"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}