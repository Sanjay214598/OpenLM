select * from users;
select * from roles
select * from role_assignments where userid=691 order by id
SELECT userId, roleId FROM role_assignments UNION ALL SELECT userId, roleId FROM fulfillment_role_assignments
--insert into role_assignments values (default, 442, 799, 4, 3)
--update role_assignments set programid=4,supervisorynodeid=3 where userid=691 and roleid=799
select u.username,r.name,a.* from role_assignments a, users u, roles r where a.userid=u.id and a.roleid=r.id

select * from facilities
select * from requisitions
--alter table requisitions add orderId integer
select * from orders
select * from requisition_status_changes where rnrid = 14
select * from requisition_line_items
select * from processing_periods
select * from processing_schedules

SELECT DISTINCT(R.name), R.rightType FROM (SELECT userId, roleId FROM role_assignments UNION ALL SELECT userId, roleId 
FROM fulfillment_role_assignments) A INNER JOIN users U ON A.userId = U.id 
INNER JOIN role_rights RR ON A.roleId = RR.roleId 
INNER JOIN rights R on R.name = RR.rightName 
WHERE A.userId = 442

select * from roles
--insert into Roles values (default, 'VIEW_STOCK_ON_HAND','VIEW_STOCK_ON_HAND',214598, current_timestamp, 214598,current_timestamp)
select * from role_rights
--insert into role_rights values (799, 'VIEW_STOCK_ON_HAND',214598, current_timestamp)

SELECT DISTINCT O.*, f.name 
FROM orders O INNER JOIN supply_lines S ON O.supplyLineId = S.id,
INNER JOIN fulfillment_role_assignments FRA ON S.supplyingFacilityId = FRA.facilityId,
      INNER JOIN requisitions r on r.id = O.id ,
      INNER JOIN role_rights RR ON FRA.roleId = RR.roleId ,
       INNER JOIN facilities f on f.id = r.facilityid ,
      WHERE FRA.userid = #{userId} AND RR.rightName = #{rightName} and S.supplyingFacilityId = #{supplyDepot} and r.programId = #{program} 
	  and r.periodId = #{period} 
          ORDER BY f.name ASC LIMIT #{limit} OFFSET #{offset}


          
SELECT DISTINCT O.*, f.name 
FROM orders O INNER JOIN supply_lines S ON O.supplyLineId = S.id,
INNER JOIN fulfillment_role_assignments FRA ON S.supplyingFacilityId = FRA.facilityId,
      INNER JOIN requisitions r on r.id = O.id ,
      INNER JOIN role_rights RR ON FRA.roleId = RR.roleId ,
       INNER JOIN facilities f on f.id = r.facilityid ,
      WHERE FRA.userid = #{userId} AND RR.rightName = #{rightName} and S.supplyingFacilityId = #{supplyDepot} and r.programId = #{program} 
	  and r.periodId = #{period} 
          ORDER BY f.name ASC LIMIT #{limit} OFFSET #{offset}
