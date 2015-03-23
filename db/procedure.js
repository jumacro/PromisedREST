//query for get all messages

select * from zid_messages as message
inner join zid_users on zid_users.id = message.user_id 
 left outer join zid_guilds on message.guild_id = zid_guilds.guild_id
left outer join zid_events on  message.event_id = zid_events.event_id
 left outer join zid_character_details on message.character_detail_id = zid_character_details.character_detail_id
 where (message.receiver_id = 216 OR find_in_set(216, message.guild_receiver_id))
and message.is_message_parent = 1
and (NOT FIND_IN_SET(216, message.is_garbage_message) 
OR message.is_garbage_message = null
OR message.is_sent_delete = 1)
AND message.is_message_active =1
order by message.message_id desc


select * from zid_messages as message
inner join zid_users on zid_users.id = message.user_id 
 left outer join zid_guilds on message.guild_id = zid_guilds.guild_id
 left outer join zid_character_details on message.character_detail_id = zid_character_details.character_detail_id
 where (message.receiver_id = 216 OR find_in_set(216, message.guild_receiver_id) OR user_id = 216)
 and message.guild_id = null
and message.is_message_active =1
order by message.message_id desc


select message.*, zu.username, zcd.character_name, zg.game_name from zid_messages as message  inner join zid_users as zu on zu.id = message.user_id  left outer join zid_character_details as zcd on message.character_detail_id = zcd.character_detail_id left outer join zid_games as zg on zg.id = zcd.game_id where message.guild_id = null message.message_id IN () or message.parent_message_id IN () and message.is_message_active = 1 order by message.last_modified_date DESC limit 0, 25

select feed.*, zid_users.*  from zid_feeds as feed join zid_users on zid_users.id = feed.id order by feed.feed_id ASC limit 0, 10






SELECT *
FROM (
    ($query1)
             UNION ALL
    ($query2)
)  a
ORDER BY last_modified_date, rank DESC