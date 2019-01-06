       /*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

function UserController($scope, $location, GeographicZones, $dialog, Users, Facility, messageService, user, roles_map, programs, supervisoryNodes, deliveryZones, enabledWarehouses, $timeout, UpdatePassword) {
  $scope.userNameInvalid = false;
  $scope.showHomeFacilityRoleMappingError = false;
  $scope.showSupervisorRoleMappingError = false;
  $scope.user = user || {homeFacilityRoles: [], restrictLogin: false};
  $scope.supervisoryNodes = supervisoryNodes;
  $scope.warehouses = enabledWarehouses;
  $scope.deliveryZones = deliveryZones;
  $scope.$parent.userId = null;
  $scope.message = "";
  $scope.$parent.message = "";

  var originalUser = $.extend(true, {}, user);

	$scope.selectRole= null;
	$scope.geoZone = null;
	$scope.selectRoleGroups = [{code: 1, name: "Manufacturer"},{code: 2, name: "Retailer"},{code: 3, name: "Supplier"},{code: 4, name: "Distributor"}];
	$scope.selectRoleUpdate = function () {
		var replacements = {
			"%CUSTOMERNAME%": $scope.user.lastName+", "+ $scope.user.firstName,
			"%OFFICEPHONE%": $scope.user.officePhone,
			"%PHONE%": $scope.user.cellPhone,
			"%Email%": $scope.user.email,
			"%ENTITYROLE%":$scope.selectRole.name,
			"%SLATERM%":$scope.user.sla,
			"%MMQ%":$scope.user.mmq,
			"%geoZone%":$scope.geoZone.name,
			"%DATE%":new Date()
		};
		var str = "<div class=WordSection1><table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='margin-left:-.5pt;border-collapse:collapse'> <tr style='height:13.2pt'>  <td width=127 valign=bottom style='width:95.0pt;padding:0cm 0cm 0cm 0cm;  height:13.2pt'><a name=page1></a>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=577 colspan=2 valign=bottom style='width:433.0pt;padding:0cm 0cm 0cm 0cm;  height:13.2pt'>  <p class=MsoNormal style='margin-left:64.0pt'><b><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>PREMIUM  ONBOARDING AGREEMENT</span></b></p>  </td> </tr> <tr style='height:11.25pt'>  <td width=127 valign=bottom style='width:95.0pt;border:none;border-bottom:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:11.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border:none;border-bottom:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:11.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=360 valign=bottom style='width:270.0pt;border:none;border-bottom:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:11.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td> </tr> <tr style='height:18.5pt'>  <td width=127 valign=bottom style='width:95.0pt;border:none;border-left:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal style='margin-left:5.0pt'><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif;background:  yellow'>Customer</span><span lang=EN-US style='font-size:10.0pt;font-family:  'Bookman Old Style',serif'>: %CUSTOMERNAME%</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=360 valign=bottom style='width:270.0pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal style='margin-left:5.0pt'><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif;background:  yellow'>Contact</span><span lang=EN-US style='font-size:10.0pt;font-family:  'Bookman Old Style',serif'>: %OFFICEPHONE%</span></p>  </td> </tr> <tr style='height:2.25pt'>  <td width=127 valign=bottom style='width:95.0pt;border-top:none;border-left:  solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:  none;padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border-top:none;border-left:  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=360 valign=bottom style='width:270.0pt;border-top:none;border-left:  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td> </tr> <tr style='height:18.5pt'>  <td width=127 valign=bottom style='width:95.0pt;border:none;border-left:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal style='margin-left:5.0pt'><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif;background:  yellow'>Address</span><span lang=EN-US style='font-size:10.0pt;font-family:  'Bookman Old Style',serif'>:</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=360 valign=bottom style='width:270.0pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal style='margin-left:5.0pt'><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif;background:  yellow'>Phone</span><span lang=EN-US style='font-size:10.0pt;font-family:  'Bookman Old Style',serif'>:%PHONE%</span></p>  </td> </tr> <tr style='height:2.25pt'>  <td width=127 valign=bottom style='width:95.0pt;border-top:none;border-left:  solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:  none;padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border-top:none;border-left:  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=360 valign=bottom style='width:270.0pt;border-top:none;border-left:  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td> </tr> <tr style='height:18.5pt'>  <td width=127 valign=bottom style='width:95.0pt;border:none;border-left:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif;  background:yellow'>Entity Role: %ENTITYROLE%</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:18.5pt'>  </td>  <td width=360 valign=bottom style='width:270.0pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:18.5pt'>  <p class=MsoNormal style='margin-left:5.0pt'><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif;background:  yellow'>E-Mail: %Email%</span></p>  </td> </tr> <tr style='height:2.25pt'>  <td width=127 valign=bottom style='width:95.0pt;border-top:none;border-left:  solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:  none;padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=217 valign=bottom style='width:163.0pt;border-top:none;border-left:  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td>  <td width=360 valign=bottom style='width:270.0pt;border-top:none;border-left:  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:2.25pt'>  <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td> </tr></table><p class=MsoNormal style='line-height:1.0pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span style='position:absolute;z-index:-1895823360;margin-left:-5px;margin-top:13px;width:704px;height:124px'><imgwidth=704 height=124 src='sample-pilot-agree_files/image001.jpg'></span></p><p class=MsoNormal style='line-height:18.15pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-top:0cm;margin-right:19.0pt;margin-bottom:0cm;margin-left:5.0pt;margin-bottom:.0001pt;text-align:justify;text-justify:inter-ideograph;line-height:85%'><b><span lang=EN-US style='font-size:10.0pt;line-height:85%;font-family:'Bookman Old Style',serif'>Services: </span></b><b><spanlang=EN-US style='font-size:10.0pt;line-height:85%'>&#8203;</span></b><spanlang=EN-US style='font-size:10.0pt;line-height:85%;font-family:'Bookman Old Style',serif'>Companywill use commercially reasonable efforts to provide Customer the servicesdescribed in the Statement of<b> </b>Work attached as Exhibit A hereto(“Services”).</span></p><p class=MsoNormal style='line-height:4.35pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse'> <tr style='height:23.15pt'>  <td width=342 valign=bottom style='width:256.5pt;border-top:solid windowtext 1.0pt;  border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:23.15pt'>  <p class=MsoNormal style='margin-left:5.0pt'><b><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Term: </span></b><b><span  lang=EN-US style='font-size:10.0pt'>&#8203;</span></b><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Twenty Four  (24) months starting on %DATE%</span></p>  </td>  <td width=362 valign=bottom style='width:271.5pt;border:none;border-top:solid windowtext 1.0pt;  padding:0cm 0cm 0cm 0cm;height:23.15pt'>  <p class=MsoNormal style='margin-left:4.0pt'><u><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Note: </span></u><span  lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Please  refer the below sections.</span></p>  </td> </tr> <tr style='height:13.35pt'>  <td width=342 valign=bottom style='width:256.5pt;border:none;border-right:  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:13.35pt'>  <p class=MsoNormal style='margin-left:5.0pt'><span lang=EN-US  style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>The Agreement  and all of its rights hereunder will be terminated at the end of the Term.</span></p>  </td>  <td width=362 valign=bottom style='width:271.5pt;padding:0cm 0cm 0cm 0cm;  height:13.35pt'>  <p class=MsoNormal style='margin-left:4.0pt;line-height:13.3pt'><span  lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p>  </td> </tr></table><p class=MsoNormal style='line-height:4.4pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></b></p><p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></b></p><p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></b></p><p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></b></p><p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></b></p><p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>SERVICESAGREEMENT</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:86%'><span lang=EN-US style='font-size:10.0pt;line-height:86%;font-family:'Bookman Old Style',serif'>This Services Agreement ('Agreement') isentered into on this %DATE% (the “Effective Date”) between <b>Open LMIS BC SCM</b> system, Incwith a place of business and the Customer listed above (“Customer”). </span><u><spanlang=EN-US style='font-size:10.0pt;line-height:86%'>&#8203;</span></u><u><spanlang=EN-US style='font-size:10.0pt;line-height:86%;font-family:'Bookman Old Style',serif'>ThisAgreement includes and incorporates the above Order Form, as well as theattached Terms</span></u><span lang=EN-US style='font-size:10.0pt;line-height:86%;font-family:'Bookman Old Style',serif'> <u>and Conditions and all Exhibits,and contains, among other things, warranty disclaimers, liability limitationsand use limitations. </u>There shall be no force or effect to any differentterms of any related purchase order or similar form even if signed by theparties after the date hereof.</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:13.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Open LMIS BC SCM, Inc and </span></b><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>%CUSTOMERNAME%</span></b></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.7pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>By:Open LMIS BC By %ENTITYROLE%</span></p><p class=MsoNormal style='line-height:6.5pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Name:</span></p><p class=MsoNormal style='line-height:6.5pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Title:</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.25pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p></div><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'><brclear=all style='page-break-before:always'></span><div class=WordSection2><p class=MsoNormal align=center style='text-align:center'><a name=page2></a><b><u><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>TERMSAND CONDITIONS</span></u></b></p><p class=MsoNormal style='line-height:6.5pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:6.5pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-36.0pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>1.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>ONBOARDINGSERVICES AND SUPPORT</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>1.1 Subject to the terms of thisAgreement, Company will use commercially reasonable efforts to provide Customerthe Services in accordance with the Service Level Terms attached hereto asExhibit B. As part of the registration process, Customer will identify anadministrative username and password for Customer’s Company account. Companyreserves the right to refuse registration of, or cancel passwords it deemsinappropriate.</span></p><p class=MsoNormal style='line-height:4.65pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:110%'><span lang=EN-US style='font-size:10.0pt;line-height:110%;font-family:'Bookman Old Style',serif'>1.2 Subject to the terms hereof, Companywill provide Customer with reasonable technical support services in accordancewith the terms set forth in Exhibit C.</span></p><p class=MsoNormal style='line-height:3.55pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-36.0pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>2.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>RESTRICTIONSAND RESPONSIBILITIES</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>2.1 Customer will not, directly orindirectly: reverse engineer, decompile, disassemble or otherwise attempt todiscover the source code, object code or underlying structure, ideas, know-howor algorithms relevant to the Services or any software, documentation or datarelated to the Services (“Software”); modify, translate, or create derivativeworks based on the Services or any Software (except to the extent expresslypermitted by Company or authorized within the Services); use the Services orany Software for timesharing or service bureau purposes or otherwise for the benefitof a third; or remove any proprietary notices or labels. With respect to anySoftware that is distributed or provided to Customer for use on Customerpremises or devices, Company hereby grants Customer a non-exclusive,non-transferable, non-sublicensable license to use such Software during theTerm only in connection with the Services.</span></p><p class=MsoNormal style='line-height:4.8pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>2.2 Further, Customer may not remove orexport from the United States or allow the export or re-export of the Services,Software or anything related thereto, or any direct product thereof inviolation of any restrictions, laws or regulations of the United StatesDepartment of Commerce, the United States Department of Treasury Office ofForeign Assets Control, or any other United States or foreign agency orauthority. As defined in FAR section 2.101, the Software and documentation are“commercial items” and according to DFAR section 252.2277014(a)(1) and (5) aredeemed to be “commercial computer software” and “commercial computer softwaredocumentation.” Consistent with DFAR section 227.7202 and FAR section 12.212,any use modification, reproduction, release, performance, display, ordisclosure of such commercial software or commercial software documentation bythe U.S. Government will be governed solely by the terms of this Agreement andwill be prohibited except to the extent expressly permitted by the terms ofthis Agreement.</span></p><p class=MsoNormal style='line-height:16.75pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:108%'><span lang=EN-US style='font-size:10.0pt;line-height:108%;font-family:'Bookman Old Style',serif'>2.3 Customer represents, covenants, andwarrants that Customer will use the Services only in compliance with Company’sstandard published policies then in effect (the “Policy”) and all applicablelaws and regulations. Customer hereby agrees to indemnify and hold harmlessCompany against any damages, losses, liabilities, settlements and expenses(including without limitation costs and attorney's’ fees) in connection withany claim or action that arises from an alleged violation of the foregoing orotherwise from Customer’s use of Services. Although Company has no obligationto monitor Customer’s use of the Services, Company may do so and may prohibitany use of the Services it believes may be (or alleged to be) in violation ofthe foregoing.</span></p><p class=MsoNormal style='line-height:4.45pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>2.4 Customer shall beresponsible for obtaining and maintaining any equipment and ancillary servicesneeded to connect to, access or otherwise use the Services, including, withoutlimitation, modems, hardware, servers, software, operating systems, networking,web servers and the like (collectively, “Equipment”). Customer shall also beresponsible for maintaining the security of the Equipment, Customer account,passwords (including but not limited to administrative and user passwords) andfiles, and for all uses of Customer account or the Equipment with or withoutCustomer’s knowledge or consent.</span></p><p class=MsoNormal style='line-height:16.6pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.25pt;text-indent:-36.25pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>3.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>CONFIDENTIALITY;PROPRIETARY RIGHTS</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;line-height:104%'><span lang=EN-US style='font-size:10.0pt;line-height:104%;font-family:'Bookman Old Style',serif'>3.1 Each party (the“Receiving Party”) understands that the other party (the “Disclosing Party”)has disclosed or may disclose business, technical or financial informationrelating to the Disclosing Party’s business (hereinafter referred to as“Proprietary Information” of the Disclosing Party). Proprietary Information ofCompany includes non-public information regarding features, functionality andperformance of the Service. Proprietary Information of Customer includesnon-public data provided by Customer to Company to enable the provision of theServices (“Customer Data”). The Receiving Party agrees: (i) to take reasonableprecautions to protect such Proprietary Information, and (ii) not to use(except in performance of the Services or as otherwise permitted herein) ordivulge to any third person any such Proprietary Information. The DisclosingParty agrees that the foregoing shall not apply with respect to any informationafter five (5) years following the disclosure thereof or any information thatthe Receiving Party can document (a) is or becomes generally available to thepublic, or (b) was in its possession or known by it prior to receipt from theDisclosing Party, or (c) was rightfully disclosed to it without restriction bya third party, or (d) was independently developed without use of anyProprietary Information of the Disclosing Party or (e) is required to bedisclosed by law.</span></p><p class=MsoNormal style='line-height:5.4pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>3.2 Customer shall ownall right, title and interest in and to the Customer Data. Company shall ownand retain all right, title and interest in and to (a) the Services andSoftware, all improvements, enhancements or modifications thereto, (b) anysoftware, applications, inventions or other technology developed in connectionwith Services or support, and (c) all intellectual property rights related to anyof the foregoing. Customer shall grant to SA a nonexclusive, worldwide,revocable license to use <a name=page3></a>any comments, suggestions, andfeature requests (‘Feedback’) in connection with science.ai. Customer shallalso grant to SA a nonexclusive, worldwide, revocable license to use themetadata defined in Exhibit D (the “Licensed Metadata”) solely for the purposesdescribed in the License Grant set forth in Exhibit D, provided that (i) itshall not redistribute, resell, repurpose or otherwise make any use of the LicensedMetadata except for the limited uses set forth in Exhibit D; (ii) it shall onlyuse Licensed Metadata relating to the final version of a work that has beenaccepted, edited and published in print and/or digital form unless otherwiseagreed to in writing by the Authorized User(s) or unless such work and allassociated material/information is anonymized</span></p><p class=MsoNormal style='line-height:4.4pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>3.3 Notwithstanding anything to thecontrary, Company shall have the right collect and analyze data and otherinformation relating to the provision, use and performance of various aspectsof the Services and related systems and technologies (including, withoutlimitation, information concerning Customer Data and data derived therefrom),and Company will be free (during and after the term hereof) to (i) use suchinformation and data to improve and enhance the Services and for otherdevelopment, diagnostic and corrective purposes in connection with the Servicesand other Company offerings, and</span></p><p class=MsoNormal style='line-height:.25pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:0cm;text-align:justify;text-justify:inter-ideograph;text-indent:0cm;line-height:106%'><span lang=EN-US style='font-size:10.0pt;line-height:106%;font-family:'Bookman Old Style',serif'>(ii)<spanstyle='font:7.0pt 'Times New Roman''>&nbsp; </span></span><span lang=EN-USstyle='font-size:10.0pt;line-height:106%;font-family:'Bookman Old Style',serif'>Disclosesuch data solely in aggregate or other de-identified form in connection withits business. No rights or licenses are granted except as expressly set forthherein and in Exhibit D.</span></p><p class=MsoNormal style='line-height:4.15pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-36.0pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>4.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>PAYMENTOF FEES</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>4.1 Customer will pay Company the thenapplicable fees described in the Order Form for the Services in accordance withthe terms therein (the “Fees”). If Customer’s use of the Services exceeds theService Capacity set forth on the Order Form or otherwise requires the paymentof additional fees (per the terms of this Agreement), Customer shall be billedfor such and Customer agrees to pay the additional fees in the manner providedherein. Company reserves the right to change the Fees or applicable charges andto institute new charges and Fees at the end of the Initial Service Term orthen current renewal term, upon thirty (30) days prior notice to Customer(which may be sent by email). If Customer believes that Company has billedCustomer incorrectly, Customer must contact Company no later than 60 days afterthe closing date on the first billing statement in which the error or problemappeared, in order to receive an adjustment or credit. Inquiries should bedirected to Company’s customer support department.</span></p><p class=MsoNormal style='line-height:4.75pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>4.2 Company may choose to bill throughan invoice, in which case, full payment for invoices issued in any given monthmust be received by Company thirty (30) days after the mailing date of theinvoice. Unpaid amounts are subject to a finance charge of 1.5% per month onany outstanding balance, or the maximum permitted by law, whichever is lower,plus all expenses of collection and may result in immediate termination ofService. Customer shall be responsible for all taxes associated with Servicesother than U.S. taxes based on Company’s net income.</span></p><p class=MsoNormal style='line-height:18.3pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.25pt;text-indent:-36.25pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>5.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>TERMAND TERMINATION</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;line-height:117%'><span lang=EN-US style='font-size:10.0pt;line-height:117%;font-family:'Bookman Old Style',serif'>5.1 Subject to earliertermination as provided below, this Agreement is for the Term as specified inthe Agreement Form.</span></p><p class=MsoNormal style='line-height:3.05pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>5.2 In addition to anyother remedies it may have, either party may also terminate this Agreement uponthirty (30) days’ notice (or without notice in the case of nonpayment), if theother party materially breaches any of the terms or conditions of thisAgreement. Customer will pay in full for the Services up to and including thelast day on which the Services are provided. Upon any termination, Company willmake all Customer Data available to Customer for electronic retrieval for aperiod of thirty (30) days, but thereafter Company may, but is not obligatedto, delete stored Customer Data. All sections of this Agreement which by theirnature should survive termination will survive termination, including, withoutlimitation, accrued rights to payment, confidentiality obligations, warrantydisclaimers, and limitations of liability.</span></p><p class=MsoNormal style='line-height:4.75pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.25pt;text-indent:-36.25pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>6.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>WARRANTYAND DISCLAIMER</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;text-indent:36.0pt;line-height:106%'><span lang=EN-USstyle='font-size:10.0pt;line-height:106%;font-family:'Bookman Old Style',serif'>Companyshall use reasonable efforts consistent with prevailing industry standards tomaintain the Services in a manner which minimizes errors and interruptions inthe Services and shall perform the Services in a professional and workmanlikemanner. Services may be temporarily unavailable for scheduled maintenance orfor unscheduled emergency maintenance, either by Company or by third-partyproviders, or because of other causes beyond Company’s reasonable control, butCompany shall use reasonable efforts to provide advance notice in writing or bye-mail of any scheduled service disruption. </span><span lang=EN-USstyle='font-size:10.0pt;line-height:106%'>&#8203;</span><span lang=EN-USstyle='font-size:10.0pt;line-height:106%;font-family:'Bookman Old Style',serif'>HOWEVER,COMPANY DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR FREE;NOR DOES IT MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM USEOF THE SERVICES. EXCEPT AS EXPRESSLY SET FORTH IN THIS SECTION, THE SERVICESARE PROVIDED “AS IS” AND COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED,INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY ANDFITNESS</span></p><p class=MsoNormal style='line-height:.85pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;line-height:108%'><span lang=EN-US style='font-size:10.0pt;line-height:108%;font-family:'Bookman Old Style',serif'>FOR A PARTICULAR PURPOSEAND NON-INFRINGEMENT.</span></p><p class=MsoNormal style='line-height:9.9pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.25pt;text-indent:-36.25pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>7.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>INDEMNITY</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;text-indent:36.0pt;line-height:105%'><span lang=EN-USstyle='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>Companyshall hold Customer harmless from liability to third parties resulting frominfringement by the Service of any United States patent or any copyright ormisappropriation of any trade secret, provided Company is promptly notified ofany and all threats, claims and proceedings related thereto and givenreasonable assistance and the opportunity to assume sole control over defenseand settlement; Company will not be responsible for any settlement it does notapprove in writing. The foregoing obligations do not apply with respect toportions or components </span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><a name=page4></a><span lang=EN-USstyle='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>ofthe Service (i) not supplied by Company, (ii) made in whole or in part inaccordance with Customer specifications, (iii) that are modified after deliveryby Company, (iv) combined with other products, processes or materials where thealleged infringement relates to such combination, (v) where Customer continuesallegedly infringing activity after being notified thereof or after beinginformed of modifications that would have avoided the alleged infringement, or(vi) where Customer’s use of the Service is not strictly in accordance withthis Agreement. If, due to a claim of infringement, the Services are held by acourt of competent jurisdiction to be or are believed by Company to beinfringing, Company may, at its option and expense (a) replace or modify theService to be non-infringing provided that such modification or replacementcontains substantially similar features and functionality, (b) obtain forCustomer a license to continue using the Service, or (c) if neither of theforegoing is commercially practicable, terminate this Agreement and Customer’srights hereunder and provide Customer a refund of any prepaid, unused fees forthe Service.</span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.4pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-36.0pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>8.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>LIMITATIONOF LIABILITY</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:10.0pt;text-align:justify;text-justify:inter-ideograph;text-indent:36.0pt;line-height:104%'><span lang=EN-USstyle='font-size:10.0pt;line-height:104%;font-family:'Bookman Old Style',serif'>NOTWITHSTANDINGANYTHING TO THE CONTRARY, EXCEPT FOR BODILY INJURY OF A PERSON, COMPANY AND ITSSUPPLIERS (INCLUDING BUT NOT LIMITED TO ALL EQUIPMENT AND TECHNOLOGYSUPPLIERS), OFFICERS, AFFILIATES, REPRESENTATIVES, CONTRACTORS AND EMPLOYEES SHALLNOT BE RESPONSIBLE OR LIABLE WITH RESPECT TO ANY SUBJECT MATTER OF THISAGREEMENT OR TERMS AND CONDITIONS RELATED THERETO UNDER ANY CONTRACT,NEGLIGENCE, STRICT LIABILITY OR OTHER THEORY: (A) FOR ERROR OR INTERRUPTION OFUSE OR FOR LOSS OR INACCURACY OR CORRUPTION OF DATA OR COST OF PROCUREMENT OFSUBSTITUTE GOODS, SERVICES OR TECHNOLOGY OR LOSS OF BUSINESS; (B) FOR ANYINDIRECT, EXEMPLARY, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES; (C) FOR ANYMATTER BEYOND COMPANY’S REASONABLE CONTROL; OR (D) FOR ANY AMOUNTS THAT,TOGETHER WITH AMOUNTS ASSOCIATED WITH ALL OTHER CLAIMS, EXCEED THE FEES PAID BYCUSTOMER TO COMPANY FOR THE SERVICES UNDER THIS AGREEMENT IN THE 12 MONTHSPRIOR TO THE ACT THAT GAVE RISE TO THE LIABILITY, IN EACH CASE, WHETHER OR NOTCOMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</span></p><p class=MsoNormal style='line-height:9.95pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.25pt;text-indent:-36.25pt'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>9.<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></b><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>MISCELLANEOUS</span></b></p><p class=MsoNormal style='line-height:6.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:.25pt;text-align:justify;text-justify:inter-ideograph;text-indent:36.0pt;line-height:104%'><span lang=EN-USstyle='font-size:10.0pt;line-height:104%;font-family:'Bookman Old Style',serif'>Ifany provision of this Agreement is found to be unenforceable or invalid, thatprovision will be limited or eliminated to the minimum extent necessary so thatthis Agreement will otherwise remain in full force and effect and enforceable.This Agreement is not assignable, transferable or sublicensable by Customerexcept with Company’s prior written consent. Company may transfer and assignany of its rights and obligations under this Agreement without consent. ThisAgreement is the complete and exclusive statement of the mutual understandingof the parties and supersedes and cancels all previous written and oralagreements, communications and other understandings relating to the subjectmatter of this Agreement, and that all waivers and modifications must be in awriting signed by both parties, except as otherwise provided herein. No agency,partnership, joint venture, or employment is created as a result of thisAgreement and Customer does not have any authority of any kind to bind Companyin any respect whatsoever. In any action or proceeding to enforce rights underthis Agreement, the prevailing party will be entitled to recover costs andattorneys’ fees. All notices under this Agreement will be in writing.</span></p></div><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'><brclear=all style='page-break-before:always'></span><div class=WordSection3><p class=MsoNormal align=center style='margin-right:-2.95pt;text-align:center'><aname=page5></a><b><u><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>EXHIBITA</span></u></b></p><p class=MsoNormal style='line-height:12.5pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal align=center style='margin-right:-2.95pt;text-align:center'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Statementof Work</span></b></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:14.5pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Premium onboarding objectives</span></b></p><p class=MsoNormal style='line-height:1.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:11.0pt;line-height:108%'><spanlang=EN-US style='font-size:10.0pt;line-height:108%;font-family:'Bookman Old Style',serif'>Theaim of premium onboarding is to assist %CUSTOMERNAME% in setting up a profile in Open LMIS BC-SCM system with a designated role andto provide %CUSTOMERNAME% with full support inthe E2E process.</span></p><p class=MsoNormal style='line-height:9.9pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><b><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>SA responsibilities</span></b></p><p class=MsoNormal style='line-height:1.7pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:6.0pt;text-align:justify;text-justify:inter-ideograph;line-height:106%'><span lang=EN-US style='font-size:10.0pt;line-height:106%;font-family:'Bookman Old Style',serif'>SA will provide %CUSTOMERNAME% with full access to science.ai forup to 12 active users per month, during the 12 month Term. During the Term, SAwill work with %CUSTOMERNAME% to assessfeature requirements and to discuss prioritization of planned science.aifeature development as needed to meet those requirements.</span></p><p class=MsoNormal style='line-height:10.35pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-right:3.0pt;line-height:108%'><spanlang=EN-US style='font-size:10.0pt;line-height:108%;font-family:'Bookman Old Style',serif'>SAwill provide %CUSTOMERNAME% with advancedsupport during the term, including a dedicated set of rights to perform actionsin the system, including to set up:</span></p><p class=MsoNormal style='line-height:.05pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-18.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&#9679;<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Orderof products </span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-18.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&#9679;<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Creationof Requisitions</span></p><p class=MsoNormal style='margin-left:36.0pt;text-indent:-18.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&#9679;<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>SLAadherence</span></p><p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal><img width=69 height=28src='sample-pilot-agree_files/image002.png' align=left hspace=12 vspace=5alt='3 days'></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>SLA term:</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>%SLATERM%</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><img width=63 height=29src='sample-pilot-agree_files/image003.png' align=left hspace=12 vspace=5alt=XYZ><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Minimum Maintenance quantity:</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>%MMQ%</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><img width=307 height=28src='sample-pilot-agree_files/image004.png' align=left hspace=12 vspace=5alt=XYZ><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>GeographicZone: </span></p><p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>%geoZone%</span></p><p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><img width=735 height=137src='sample-pilot-agree_files/image005.png' align=left hspace=12 vspace=5alt='Important Points:&#13;&#10;&#13;&#10;Geographic Zone: This when selected will lead to the system level mapping of Programs and products to be serviced by the entity. The entity will only cater to the flow of products in this geo zone selected.&#13;&#10;&#13;&#10;Minimum Maintenance quantity: This is the individual product specific quantity that the entity has to maintain in its own warehouse at any given point in time. If this is breached (lower than allowed quantity), an auto requisition with this quantity will be created in the system.&#13;&#10;'></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:16.75pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal align=center style='margin-right:-1.95pt;text-align:center'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>5</span></p></div><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'><brclear=all style='page-break-before:always'></span><div class=WordSection4><p class=MsoNormal align=center style='margin-right:1.0pt;text-align:center'><aname=page6></a><b><u><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>EXHIBITB</span></u></b></p><p class=MsoNormal style='line-height:12.5pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal align=center style='margin-right:1.0pt;text-align:center'><b><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>ServiceLevel Terms</span></b></p><p class=MsoNormal style='line-height:12.7pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='text-align:justify;text-justify:inter-ideograph;text-indent:36.0pt;line-height:105%'><span lang=EN-US style='font-size:10.0pt;line-height:105%;font-family:'Bookman Old Style',serif'>The Services shall beavailable 99.95%, measured monthly, excluding holidays and weekends andscheduled maintenance. If Customer requests maintenance during these hours, anyuptime or downtime calculation will exclude periods affected by suchmaintenance. Further, any downtime resulting from outages of third partyconnections or utilities or other reasons beyond Company’s control will also beexcluded from any such calculation. Customer's sole and exclusive remedy, andCompany's entire liability, in connection with Service availability shall bethat for each period of downtime lasting longer than one hour, Company willcredit Customer 5% of Service fees for each period of 30 or more consecutiveminutes of downtime; provided that no more than one such credit will accrue perday. Downtime shall begin to accrue as soon as Customer (with notice toCompany) recognizes that downtime is taking place, and continues until theavailability of the Services is restored. In order to receive downtime credit,Customer must notify Company in writing within 24 hours from the time ofdowntime, and failure to provide such notice will forfeit the right to receivedowntime credit. Such credits may not be redeemed for cash and shall not becumulative beyond a total of credits for one (1) week of Service Fees in anyone (1) calendar month in any event. Company will only apply a credit to themonth in which the incident occurred. Company’s blocking of data communicationsor other Service in accordance with its policies shall not be deemed to be afailure of Company to provide adequate service levels under this Agreement.</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>*******Inscope**************</span></p><p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;line-height:10.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>AuditHistory</span></p><p class=MsoListParagraphCxSpMiddle style='text-indent:-18.0pt;line-height:10.0pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Orderto Requisition Tracking</span></p><p class=MsoListParagraphCxSpMiddle style='text-indent:-18.0pt;line-height:10.0pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Smartcontract</span></p><p class=MsoListParagraphCxSpMiddle style='text-indent:-18.0pt;line-height:10.0pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>SharedLedger (View all inventory)</span></p><p class=MsoListParagraphCxSpLast style='text-indent:-18.0pt;line-height:10.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Secure(Role specific)</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>&nbsp;</span></p><p class=MsoNormal style='line-height:10.0pt'><span lang=EN-USstyle='font-size:10.0pt;font-family:'Bookman Old Style',serif'>***** <spanstyle='color:red'>Out of scope </span>*************</span></p><p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;line-height:10.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>SLAbreach</span></p><p class=MsoListParagraphCxSpMiddle style='text-indent:-18.0pt;line-height:10.0pt'><span lang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Penalty</span></p><p class=MsoListParagraphCxSpLast style='text-indent:-18.0pt;line-height:10.0pt'><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>-<spanstyle='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><spanlang=EN-US style='font-size:10.0pt;font-family:'Bookman Old Style',serif'>Ranking</span></p></div>";
		str = str.replace(/%\w+%/g, function(all) {
			return replacements[all] || all;
		});
		console.log($scope.selectRole);
		var dialogOpts = {
		  id: "disableUserDialog",
		  header: 'Terms and Conditions',
		  ok: {label: "Agree", value: true},
		  cancel: {label: "Disagree", value: false},
		  body: messageService.get(str)
		};
		OpenLmisDialog.newDialog(dialogOpts, $scope.agreeTnCCallback, $dialog);
	}
	$scope.agreeTnCCallback = function (result) {
		if (!result) return;
		$scope.user.Role = $scope.selectRole.code;
		//Users.disable({id: $scope.user.id}, disableSuccessFunc, errorFunc);
	};
	$scope.searchGeoZone = function (page, lastQuery) {
		if (!($scope.query || lastQuery)) return;
		lastQuery ? getGeographicZones(page, lastQuery) : getGeographicZones(page, $scope.query);
	};
	$scope.triggerGeoSearch = function (event) {
		if (event.keyCode === 13) {
		  $scope.searchGeoZone(1);
		}
	};
	getGeographicZones(1,"a");
	function getGeographicZones(page, query) {
		query = query.trim();
		$scope.searchedQuery = query;
		GeographicZones.get({"searchParam": $scope.searchedQuery, "columnName": "name", "page": page}, function (data) {
		  $scope.geoZoneList = data.geoZones;
		  $scope.pagination = data.pagination;
		  $scope.totalItems = $scope.pagination.totalRecords;
		  $scope.currentPage = $scope.pagination.page;
		  $scope.showResults = true;
		}, {});
	}
  loadUserFacility();
  preparePrograms(programs);

  $scope.rolesMap = roles_map;

  function preparePrograms(programs) {
    if (programs) {
      $.each(programs, function (index, program) {
        program.status = program.active ? messageService.get("label.active") : messageService.get('label.inactive');
      });
    }
    $scope.programsMap = _.groupBy(programs, function (program) {
      return program.push ? 'push' : 'pull';
    });
    $scope.programsMap.all = programs;
  }

  function validateHomeFacilityRoles(user) {
    if (!user.homeFacilityRoles) {
      return true;
    }
    var valid = true;
    $.each(user.homeFacilityRoles, function (index, roleAssignment) {
      if (!roleAssignment.programId || !roleAssignment.roleIds || roleAssignment.roleIds.length === 0) {
        valid = false;
        return false;
      }
    });
    return valid;
  }

  function validateSupervisorRoles(user) {
    if (!user.supervisorRoles) {
      return true;
    }

    var valid = true;
    $.each(user.supervisorRoles, function (index, roleAssignment) {
      if (!roleAssignment.programId || !roleAssignment.supervisoryNode || !roleAssignment.supervisoryNode.id || !roleAssignment.roleIds || roleAssignment.roleIds.length === 0) {
        valid = false;
        return false;
      }
    });
    return valid;
  }

  function validateShipmentRoles(user) {
    if (!user.fulfillmentRoles) {
      return true;
    }

    var valid = true;
    $.each(user.fulfillmentRoles, function (index, roleAssignment) {
      if (!roleAssignment.facilityId || !roleAssignment.roleIds || roleAssignment.roleIds.length === 0) {
        valid = false;
        return false;
      }
    });
    return valid;
  }

  var validateRoleAssignment = function (user) {
    return validateHomeFacilityRoles(user) && validateSupervisorRoles(user) && validateShipmentRoles(user);
  };

  $scope.saveUser = function () {
    var successHandler = function (msgKey) {
      $scope.showError = false;
      $scope.error = "";
      $scope.$parent.message = messageService.get(msgKey, $scope.user.firstName, $scope.user.lastName);
      $scope.$parent.userId = $scope.user.id;
      $location.path('');
    };

    var saveSuccessHandler = function (response) {
      $scope.user = response.user;
      successHandler(response.success);
    };

    var updateSuccessHandler = function () {
      successHandler("message.user.updated.success");
    };

    var errorHandler = function (response) {
      $scope.showError = true;
      $scope.message = "";
      $scope.error = response.data.error;
    };

    var requiredFieldsPresent = function (user) {
      if ($scope.userForm.$error.required || !validateRoleAssignment(user)) {
        $scope.error = messageService.get("form.error");
        $scope.showError = true;
        return false;
      } else {
        return true;
      }
    };

    if (!requiredFieldsPresent($scope.user))  return false;
    if ($scope.user.email === "") {
      $scope.user.email = null;
    }
	$scope.user.homeFacilityRoles = [];
	if($scope.selectRole.code == 1){//Manufacturer
		$scope.user.homeFacilityRoles.push({userId: $scope.user.id, programId: 4, supervisoryNode: 3, deliveryZone: null, roleIds: [791,792,793,794,795,797,798,799]});
	} else if($scope.selectRole.code == 2){//Retailer
		$scope.user.homeFacilityRoles.push({userId: $scope.user.id, programId: 4, supervisoryNode: 3, deliveryZone: null, roleIds: [795,796,797,798]});
	} else if($scope.selectRole.code == 3){//Supplier
		$scope.user.homeFacilityRoles.push({userId: $scope.user.id, programId: 4, supervisoryNode: 3, deliveryZone: null, roleIds: [794,795,796,797,798]});
	} else if($scope.selectRole.code == 4){//Distributor
		$scope.user.homeFacilityRoles.push({userId: $scope.user.id, programId: 4, supervisoryNode: 3, deliveryZone: null, roleIds: [795,796,797,798]});
	}
    if ($scope.user.id) {
      Users.update({id: $scope.user.id}, $scope.user, updateSuccessHandler, errorHandler);
    } else {
      Users.save({}, $scope.user, saveSuccessHandler, errorHandler);
    }
    return true;
  };

  $scope.validateUserName = function () {
    $scope.userNameInvalid = $scope.user.userName !== null && $scope.user.userName.trim().indexOf(' ') >= 0;
  };

  $scope.toggleSlider = function () {
    if (!$scope.facilitySelected) {
      $scope.showSlider = !$scope.showSlider;
      $scope.extraParams = {"virtualFacility": false, "enabled": null };
    }
  };

  $scope.associate = function (facility) {
    $scope.user.facilityId = facility.id;
    $scope.facilitySelected = facility;
    loadUserFacility();
    $scope.query = null;
    $scope.showSlider = !$scope.showSlider;
  };

  $scope.clearSelectedFacility = function (result) {
    if (!result) return;

    $scope.facilitySelected = null;
    $scope.allSupportedPrograms = null;
    $scope.user.homeFacilityRoles = null;
    $scope.user.facilityId = null;

    $timeout(function () {
      angular.element("#searchFacility").focus();
    });
  };

  $scope.confirmFacilityDelete = function () {
    var dialogOpts = {
      id: "deleteFacilityModal",
      header: 'delete.facility.header',
      body: 'confirm.programRole.deletion'
    };
    OpenLmisDialog.newDialog(dialogOpts, $scope.clearSelectedFacility, $dialog);
  };

  function loadUserFacility() {
    if (!$scope.user) return;

    if (!utils.isNullOrUndefined($scope.user.facilityId)) {
      if (utils.isNullOrUndefined($scope.allSupportedPrograms)) {
        Facility.get({id: $scope.user.facilityId}, function (data) {
          $scope.allSupportedPrograms = _.filter(data.facility.supportedPrograms, function (supportedProgram) {
            return !supportedProgram.program.push;
          });

          $scope.facilitySelected = data.facility;
        }, {});
      }
    }
  }

  $scope.cancel = function () {
    $scope.$parent.message = "";
    $scope.$parent.userId = undefined;
    $location.path('#/search');
  };

  var clearErrorAndSetMessage = function (msgKey) {
    $scope.showError = "false";
    $scope.error = "";
    $scope.message = messageService.get(msgKey, $scope.user.firstName, $scope.user.lastName);
  };

  var errorFunc = function (data) {
    $scope.showError = "true";
    $scope.message = "";
    $scope.error = data.error;
  };

  $scope.showConfirmUserDisableModal = function () {
    var dialogOpts = {
      id: "disableUserDialog",
      header: 'disable.user.header',
      body: messageService.get('disable.user.confirm', $scope.user.firstName, $scope.user.lastName)
    };
    OpenLmisDialog.newDialog(dialogOpts, $scope.disableUserCallback, $dialog);
  };

  $scope.disableUserCallback = function (result) {
    if (!result) return;
    Users.disable({id: $scope.user.id}, disableSuccessFunc, errorFunc);
  };

  var disableSuccessFunc = function (data) {
    clearErrorAndSetMessage(data.success);
    $scope.user = originalUser;
    $scope.user.active = false;
  };

  $scope.showConfirmUserRestoreModal = function () {
    var dialogOpts = {
      id: "restoreUserDialog",
      header: 'enable.user.header',
      body: messageService.get('enable.user.confirm', $scope.user.firstName, $scope.user.lastName)
    };
    OpenLmisDialog.newDialog(dialogOpts, $scope.restoreUserCallback, $dialog);
  };

  $scope.restoreUserCallback = function (result) {
    if (!result) return;
    $scope.user.active = true;
    Users.update({id: $scope.user.id}, $scope.user, restoreSuccessFunc, errorFunc);
  };

  $scope.getMessage = function (key) {
    return messageService.get(key);
  };

  $scope.changePassword = function (user) {
    if (user.active) {
      $scope.user.password1 = $scope.user.password2 = $scope.message = $scope.passwordError = "";
      $scope.changePasswordModal = true;
    }
    else {
      $scope.message = "";
      $scope.error = messageService.get("user.is.disabled");
    }
  };

  $scope.updatePassword = function () {
    var reWhiteSpace = new RegExp("\\s");
    var digits = new RegExp("\\d");
    if ($scope.user.password1.length < 8 || $scope.user.password1.length > 16 || !digits.test($scope.user.password1) ||
      reWhiteSpace.test($scope.user.password1)) {
      $scope.passwordError = messageService.get("error.password.invalid");
      return;
    }

    if ($scope.user.password1 != $scope.user.password2) {
      $scope.passwordError = messageService.get('error.password.mismatch');
      return;
    }

    UpdatePassword.update({userId: $scope.user.id}, $scope.user.password1, function (data) {
      $scope.message = data.success;
      $scope.error = "";
      $scope.resetPasswordModal();
    }, {});
  };

  $scope.resetPasswordModal = function () {
    $scope.changePasswordModal = false;
  };

  var restoreSuccessFunc = function (data) {
    clearErrorAndSetMessage("msg.user.restore.success");
    $('.form-group').find(':input').removeAttr('disabled');
  };

  $timeout(function () {
    accordion.expandCollapseToggle($('.accordion-section:first .heading'));
  });
}

UserController.resolve = {

  user: function ($q, Users, $route, $timeout) {
    var userId = $route.current.params.userId;
    if (!userId) return undefined;
    var deferred = $q.defer();
    $timeout(function () {
      Users.get({id: userId}, function (data) {
        deferred.resolve(data.user);
      }, function () {
      });
    }, 100);
    return deferred.promise;
  },

  roles_map: function ($q, Roles, $timeout) {
    var deferred = $q.defer();

    $timeout(function () {
      Roles.get({}, function (data) {
        deferred.resolve(data.roles_map);
      }, function () {
      });
    }, 100);

    return deferred.promise;
  },

  programs: function ($q, Program, $timeout) {
    var deferred = $q.defer();

    $timeout(function () {
      Program.get({}, function (data) {
        deferred.resolve(data.programs);
      }, function () {
      });
    }, 100);

    return deferred.promise;
  },

  supervisoryNodes: function ($q, SupervisoryNodes, $timeout) {
    var deferred = $q.defer();

    $timeout(function () {
      SupervisoryNodes.get({}, function (data) {
        deferred.resolve(data.supervisoryNodes);
      }, function () {
      });
    }, 100);

    return deferred.promise;
  },

  deliveryZones: function ($q, DeliveryZone, $timeout) {
    var deferred = $q.defer();

    $timeout(function () {
      DeliveryZone.get({}, function (data) {
        deferred.resolve(data.deliveryZones);
      }, function () {
      });
    }, 100);

    return deferred.promise;
  },

  enabledWarehouses: function ($q, EnabledWarehouse, $timeout) {
    var deferred = $q.defer();

    $timeout(function () {
      EnabledWarehouse.get({}, function (data) {
        deferred.resolve(data.enabledWarehouses);
      }, function () {
      });
    }, 100);

    return deferred.promise;
  }
};
