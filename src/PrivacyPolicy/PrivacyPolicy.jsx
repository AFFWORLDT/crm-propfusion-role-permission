import StikyNav from './Common/StickyNav';
import { Outlet } from 'react-router-dom';
function PrivacyPolicy() {
  return (
   <>
    <div className="sectionContainer">
        <StikyNav isSidebarOpen={false}/>
      <section className="sectionStyles"> 
        <div className='sectionDiv2'>
        <Outlet/>
        </div>
       </section> 
    </div>
   </>
  );
}

export default PrivacyPolicy;
