import React from 'react'
import SectionTop from '../../ui/SectionTop'
import useEditMetaAdForm from '../../features/admin/MetaAds/useEditMetaAdForm';
import { useNavigate, useParams } from 'react-router-dom';
import MultiStepForm from '../../ui/MultiStepForm';
import MetaAdForm from '../../features/admin/MetaAds/MetaAdForm';
import { PROPERTY_TYPES } from '../../utils/constants';
import { useMetaAdForm } from '../../features/admin/MetaAds/useMetaAdForm';
import Spinner from '../../ui/Spinner';
import toast from 'react-hot-toast';

function EditMetaAds() {
  const {formId} = useParams();
  const { isPending,editMetaAdForm } = useEditMetaAdForm();
  const {data:metaAdData,isLoading:isLoadingMetaAd,error:errorMetaAd} = useMetaAdForm(formId);
 
  const navigate = useNavigate();
  const metaData = metaAdData ?? [];
  function renderStep(step) {
    switch (step) {
      case 1:
        return <MetaAdForm  metaDataType={metaData[0]?.clientType}/>;
        default:
            return null;
    }
    
  }
  const defaultValues = {
    ...metaData[0],
    agent_Id: metaData[0]?.agent_info ? {
        label: metaData[0]?.agent_info?.name ?? "Select",
        value: metaData[0]?.agent_info?.id ?? "",
      } : null,
    form_id: metaData[0]?.form_id ? {
          label: metaData[0]?.facebook_form_name ?? "Select",
        value: metaData[0]?.form_id ?? "",
      } : null,
    page_id: metaData[0]?.page_id ? {
        label: metaData[0]?.page_name ?? "Select",
        value: metaData[0]?.page_id ?? "",
      } : null,
    property_type: PROPERTY_TYPES?.filter((obj) =>
        metaData[0]?.property_type?.includes(obj?.value)
    ),
    preferred_property: metaData[0]?.preferred_property_info?.map((item) => {
      return { label: item?.title, value: item?.id };
    }),
    preferred_project: metaData[0]?.preferred_project_info?.map((item) => {
        return { label: item?.name, value: item?.id };
    }),
    preferred_developer: metaData[0]?.preferred_developer_info?.map((item) => {
        return { label: item?.name, value: item?.id };
    }),
      location: metaData[0]?.location ? {
        label: metaData[0]?.location ? `${metaData[0]?.location?.city ?? ""} - ${metaData[0]?.location?.community ?? ""}` : "Select",
        value: metaData[0]?.location ?? null,
      } : null,


};
  function handleFormSubmit(data, handleReset) {
    const newData = {
      ...data,
      location: data?.location?.value ?? null,
      agent_Id: data.agent_Id?.value ?? null,
      form_id: data.form_id?.value ?? null,
      page_id: data.page_id?.value ?? null,
      area_id: data?.area_id?.map?.((item) => item.value) ?? [],
      property_type:
        data.property_type?.map?.((item) => item.value) ?? [],
      preferred_property: data.preferred_property?.map?.((item) => item.value) ?? [],
      preferred_project: data.preferred_project?.map?.((item) => item.value) ?? [],
      preferred_developer: data.preferred_developer?.map?.((item) => item.value) ?? [],
    }
    if (newData.clientType === "RENT") delete newData.projectType;

    editMetaAdForm({formId,formData:newData}, {
      onSuccess: () => {
        navigate("/admin/general/manage-meta-ads",{replace:true});
        toast.success("Meta Ad Updated Successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }
  if(isLoadingMetaAd) return  <Spinner  type={"fullPage"}/>
  return (
    <div className="sectionContainer">
        <SectionTop heading="Edit Meta Ads" />
        <section className='sectionStyles'>
        <MultiStepForm
                    totalSteps={1}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                      isSubmitting={isPending}
                    defaultValues={defaultValues}
                />
        </section>
    </div>
  )
}

export default EditMetaAds