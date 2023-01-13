// Copyright 2023 Owen M. Jones. All rights reserved.
//
// This file is part of BlogTheWorld.
//
// BlogTheWorld is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// BlogTheWorld is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with BlogTheWorld. If not, see <https://www.gnu.org/licenses/>.

const PrivacyPolicyPage = () => {

	return (
		<div>
			<h2>Privacy Policy</h2>
			<hr/>
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-10 col-md-6'>
						<p className="text-start">
							This Privacy Policy describes what data we collect from you in the course of your use of this website, and
							the conditions in which this data is stored, accessed, retrieved and removed from our systems. You agree
							that by accessing this website, you have read, understood and agree to the use of your data as described
							in this Privacy Policy. If you do not agree to any of the terms of this Privacy Policy, you are prohibited
							from using this website and must discontinue use immediately.
						</p>
						<h4 className="text-md pt-2 font-semibold">What data do we collect?</h4>
						<ul className="list-disc text-start">
							<li>
								When you register as a user of this website, we collect the e-mail address which you communicate to us.
							</li>
							<li>
								We collect data which you communicate to us in the course of your use of this website. Such data may
								include the titles, URLs, and other details of blog posts, the details of which you communicate to us
								using the interface of this website.
							</li>
							<li>
								We collect the reply address, subject and text of any messages you send to us using the communication
								facilities and features provided by and through this website.
							</li>
						</ul>
						<h4 className="text-md pt-2 font-semibold">How we will use your data</h4>
						<ul className="list-disc text-start">
							<li>
								We will only use your data to ensure the normal operation and functioning of this website, including
								sending communications to you by e-mail where necessary to ensure the proper function of the website.
							</li>
							<li>
								Whenever you interact with this website as a logged-in user, we may use the information you have
								communicated to us to enhance your experience, including by pre-filling form fields with your data as
								appropriate.
							</li>
							<li>
								We will never sell or communicate any of the data you have provided to us to any third party, except to
								relevant law-enforcement agencies where required by the laws and regulations governing the jurisdiction
								of this website.
							</li>
						</ul>
						<h4 className="text-md pt-2 font-semibold">How we will store your data</h4>
						<ul className="list-disc text-start">
							<li>
								Your e-mail address and data you provide to us will be stored in a database hosted by
								our chosen cloud service provider. We reserve the right to change cloud service provider at any time,
								including changing to a provider domiciled or with data storage facilities situated in a different
								jurisdiction from the previous provider.
							</li>
							<li>
								Your data will be stored securely, protected by the security measures of the chosen cloud service
								provider which may include passwords, one-time passwords, biometric identification, security keys,
								access tokens or any combination of these. We will make every reasonable effort to ensure that these
								security measures are not compromised, however we cannot be held liable for any theft, loss or
								corruption of data howsoever caused, including loss or corruption as a result of these security measures
								being compromised.
							</li>
							<li>
								We will store your data for a period of up to three (3) years from the last use of your account to add,
								edit or update the details of a blog post on this site. If you have never added, edited or updated the
								details of a blog post, we will store your data for a period of up to three (3) years.
							</li>
							<li>
								Data associated with e-mails or messages which you communicate to us using the communication facilities
								and features provided by and through this website will be stored on the servers of our chosen e-mail
								service provider for as long as necessary for us to consider the matter resolved. We will delete e-mail
								conversations within thirty (30) days once we consider the matter resolved.
							</li>
						</ul>
						<h4 className="text-md pt-2 font-semibold">Your data protection rights</h4>
						<p className="text-start">
							You have certain rights concerning the use, storage and dissemination of your data. These are outlined
							below:
						</p>
						<ul className="list-disc text-start">
							<li>
								<strong>The right to access –</strong> You have the right to request copies of your personal data from
								us. We may charge you a small fee for this service.
							</li>
							<li>
								<strong>The right to rectification –</strong> You have the right to request that we correct any
								information you believe is inaccurate. You also have the right to request that we complete any
								information you believe is incomplete.
							</li>
							<li>
								<strong>The right to erasure –</strong> You have the right to request that we erase your personal data,
								under certain conditions.
							</li>
							<li>
								<strong>The right to restrict processing –</strong> You have the right to request that we restrict the
								processing of your personal data, under certain conditions.
							</li>
							<li>
								<strong>The right to object to processing –</strong> You have the right to object to our processing of
								your personal data, under certain conditions.
							</li>
							<li>
								<strong>The right to object to data portability –</strong> You have the right to request that we
								transfer the data that we have collected to another organization, or directly to you, under certain
								conditions.
							</li>
						</ul>
						<p className="text-start">
							If you make a request, we have one month to respond to you. If you would like to exercise any of these
							rights, please contact us by e-mail: <strong>admin@{process.env.REACT_APP_ROOT_DOMAIN}</strong>.
						</p>
						<h4 className="text-md pt-2 font-semibold">Cookies</h4>
						<p className="text-start">
							Cookies are text files placed on your computer to collect standard internet log information and visitor
							behaviour information. When you visit this website, we may collect information from you automatically
							through cookies or similar technology.
						</p>
						<p className="text-start">
							For further information, visit&#8201;
							<a className="link hover:font-semibold" href="https://www.allaboutcookies.org" target="_blank">
								allaboutcookies.org</a>.
						</p>
						<h4 className="text-md pt-2 font-semibold">What cookies do we use?</h4>
						<ul className="list-disc text-start">
							<li>
								We may use functionality, or session, cookies to recognize you on this website and to remember your
								previously selected preferences and logged-in status.
							</li>
							<li>
								We do NOT use advertising or tracking cookies (cookies which track your navigation between different
								sites).
							</li>
						</ul>
						<h4 className="text-md pt-2 font-semibold">How to manage cookies</h4>
						<p className="text-start">
							You can set your browser to not accept cookies, and the website&#8201;
							<a className="link hover:font-semibold" href="https://www.allaboutcookies.org" target="_blank">
								allaboutcookies.org</a>&#8201;
							tells you how to remove cookies from your browser. However, if you do so, some features of this website
							may not work.
						</p>
						<h4 className="text-md pt-2 font-semibold">Privacy policies of other websites</h4>
						<p className="text-start">
							This website may contain links to other websites. Our privacy policy applies only to this website, so if
							you click on a link to another website, you should read their privacy policy.
						</p>
						<h4 className="text-md pt-2 font-semibold">Changes to our privacy policy</h4>
						<p className="text-start">
							We keep our privacy policy under regular review and place any updates on this webpage. This privacy policy
							was last updated on 13 January 2023.
						</p>
						<h4 className="text-md pt-2 font-semibold">Contact us</h4>
						<p className="text-start">
							If you have any questions about this Privacy Policy, the data we hold on you, or you would like to
							exercise one of your data protection rights, please do not hesitate to contact us.<br/>
							<strong>E-mail:</strong> admin@{process.env.REACT_APP_ROOT_DOMAIN}<br/>
							<strong>Telephone:</strong> +33 7 83 68 61 39
						</p>
						<h4 className="text-md pt-2 font-semibold">Contact the supervisory authority</h4>
						<p className="text-start">
							Should you wish to report a complaint or if you feel that we have not addressed your concerns in a
							satisfactory manner, you may contact the&#8201;
							<a className="link hover:font-semibold"
							   href="https://www.cnil.fr/fr/adresser-une-plainte"
							   target="_blank">Commission Nationale de l'Informatique et des Libertés</a> (in French).<br/>
							Address: 8 rue Vivienne, CS 30223, F-75002 Paris, Cedex 02.<br/>
							Telephone: +33 1 53 73 22 22.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PrivacyPolicyPage
