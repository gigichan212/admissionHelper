//pending boys

[
'{{repeat(10)}}',
{
'prefix':'20200{{integer(1, 3)}}',
chinese_name(tags) {
const surename = ['陳','林','黃','張','李','王','吳','劉','蔡','楊',
'許','鄭','謝','洪','郭','邱','曾','廖','賴','徐',
'周','葉','蘇','莊','呂','江','何','蕭','羅','高',
'潘','簡','朱','鍾','彭','游','詹','胡','施','沈',
'余','盧','梁','趙','顏','柯'];
const nameFirst=['家','俊', '子', '浩', '文' ];
const nameLast=['俊', '軒', '傑', '彥','賢', '朗', '豪', '健', '然', '輝', '耀'];

        return surename[tags.integer(0, surename.length - 1)]+nameFirst[tags.integer(0, nameFirst.length - 1)] +nameLast[tags.integer(0, nameLast.length - 1)] ;
      },
    'english_name':'{{firstName(["male"])}}',
    'email':'{{random("gigi1997212@live.hk", "changigi.ch@gmail.com", "acounttesting900@gmail.com")}}',

'date_of_birth':'{{date(new Date(2008, 0, 1), new Date(2016, 0,1), "YYYY-MM-dd")}}',
"place_of_birth":"Hong Kong",
"birth_cert_num":'{{integer(6012334650, 7012334650)}}',
address: '{{integer(100, 300)}} {{street()}}, {{random("N.T", "Kowloon", "Hong Kong")}}, Hong Kong',
"sex":"M",
"nationality":"Hong Kong",
"religion":null,
"phone":'{{integer(90102300, 99889899)}}',
"remarks":'{{lorem(1, "paragraphs")}}',
"have_sibling":'{{bool()}}',
recent_photo(tags) {
const photo = ['recent_photo-1618808373552.jpeg',
'recent_photo-1618808304863.jpeg',
'recent_photo-1618808229425.jpeg',
'recent_photo-1618808133186.jpeg',
'recent_photo-1618808045742.jpeg',
'recent_photo-1618807981407.jpeg',
'recent_photo-1618807921705.jpeg',
'recent_photo-1618807853039.jpeg',
'recent_photo-1618807782491.jpeg',
'recent_photo-1618807713137.jpeg',
'recent_photo-1618807629373.jpeg',
'recent_photo-1618807532119.jpeg',
'recent_photo-1618807467405.jpeg',
'recent_photo-1618807396585.jpeg',
'recent_photo-1618807316040.jpeg',
'recent_photo-1618807240206.jpeg',
'recent_photo-1618807163502.jpeg',
'recent_photo-1618806885740.jpeg'];
return photo[tags.integer(0, photo.length - 1)];
},
"interview_date_time":null,
"first_round_score":null,
"first_round_remarks":null,
"second_round_score":null,
"second_round_remarks":null,
"school_remarks":null
}

]

[
'{{repeat(10)}}',
{
'prefix':'20200{{integer(1, 3)}}',
chinese_name(tags) {
const surename = ['陳','林','黃','張','李','王','吳','劉','蔡','楊',
'許','鄭','謝','洪','郭','邱','曾','廖','賴','徐',
'周','葉','蘇','莊','呂','江','何','蕭','羅','高',
'潘','簡','朱','鍾','彭','游','詹','胡','施','沈',
'余','盧','梁','趙','顏','柯'];
const nameFirst=['詠','嘉', '盈', '子', '婉', '詩', '芷', '慧','家' ];
const nameLast=['欣', '盈', '儀', '晴','敏', '雯', '慧', '詩', '詠', '婷', '怡'];

        return surename[tags.integer(0, surename.length - 1)]+nameFirst[tags.integer(0, nameFirst.length - 1)] +nameLast[tags.integer(0, nameLast.length - 1)] ;
      },
    'english_name':'{{firstName(["female"])}}',
    'email':'{{random("gigi1997212@live.hk", "changigi.ch@gmail.com", "acounttesting900@gmail.com")}}',

'date_of_birth':'{{date(new Date(2008, 0, 1), new Date(2016, 0,1), "YYYY-MM-dd")}}',
"place_of_birth":"Hong Kong",
"birth_cert_num":'{{integer(6012334650, 7012334650)}}',
address: '{{integer(100, 300)}} {{street()}}, {{random("N.T", "Kowloon", "Hong Kong")}}, Hong Kong',
"sex":"M",
"nationality":"Hong Kong",
"religion":null,
"phone":'{{integer(90102300, 99889899)}}',
"remarks":'{{lorem(1, "paragraphs")}}',
"have_sibling":'{{bool()}}',
recent_photo(tags) {
const photo = ['recent_photo-1618808373552.jpeg',
'recent_photo-1618808304863.jpeg',
'recent_photo-1618808229425.jpeg',
'recent_photo-1618808133186.jpeg',
'recent_photo-1618808045742.jpeg',
'recent_photo-1618807981407.jpeg',
'recent_photo-1618807921705.jpeg',
'recent_photo-1618807853039.jpeg',
'recent_photo-1618807782491.jpeg',
'recent_photo-1618807713137.jpeg',
'recent_photo-1618807629373.jpeg',
'recent_photo-1618807532119.jpeg',
'recent_photo-1618807467405.jpeg',
'recent_photo-1618807396585.jpeg',
'recent_photo-1618807316040.jpeg',
'recent_photo-1618807240206.jpeg',
'recent_photo-1618807163502.jpeg',
'recent_photo-1618806885740.jpeg'];
return photo[tags.integer(0, photo.length - 1)];
},
"interview_date_time":null,
"first_round_score":null,
"first_round_remarks":null,
"second_round_score":null,
"second_round_remarks":null,
"school_remarks":null
}

]
