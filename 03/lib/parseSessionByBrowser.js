function parseSessionByBrowser(csv) {
  const records = parse(csv);
  const recordObjs = recordsToObjs(records);
  const reports = createReports(recordObjs);
  const browsers = reports.map(r => r.browser);
  const sessions = reports.map(r => r.session);
  const result = {};

  for (let i = 0; i < browsers.length; i++) {
    const browser = browsers[i];
    const session = sessions[i];

    if (result.hasOwnProperty(browser)) {
      result[browser] += session;
    } else {
      result[browser] = session;
    }
  }

  return result;
}

/**
 * CSVテキストを2次元配列にする
 * @param  {string} csv
 * @return {Array.<string[]>}
 * @example
 * parse(`ブラウザ,オペレーティング システム,セッション
 * Safari,iOS,"1,625"`)
 * =>
 * [
 *   ["ブラウザ", "オペレーティング システム", "セッション"],
 *   ["Safari", "iOS", "1,625"]
 * ]
 */
function parse(csv) {
  const fieldDelimiter = ',';
  const rRecordDelimiter = /\r?\n/;
  const rFieldDelimiter = new RegExp(fieldDelimiter);
  const rUnquotedField = /[^,"\r\n]+/;
  const rQuotedField = /"(?:[^"]|"")*"/;

  const reg = new RegExp([
    rRecordDelimiter.source,
    rFieldDelimiter.source,
    rUnquotedField.source,
    rQuotedField.source
  ].join('|'), 'g');

  const tokens = csv.match(reg);
  const result = [];
  let isHeader = true;
  let tokenIndex = 0;
  let recordIndex = 0;
  let fieldIndex = 0;

  for (; tokenIndex < tokens.length; tokenIndex++) {
    const headers = result[0] || null;
    const record = result[recordIndex] = result[recordIndex] || [];
    let token = tokens[tokenIndex];

    if (token === fieldDelimiter) {
      fieldIndex += 1;
      continue;
    }

    if (rRecordDelimiter.test(token)) {
      fieldIndex = 0;
      recordIndex += 1;
      isHeader = false;
      continue;
    }

    // ヘッダー行よりも多いフィールド数は無視する
    if (!isHeader && record.length >= headers.length) {
      continue;
    }

    if (token[0] === '"') {
      token = token.slice(1, -1);
    }
    record[fieldIndex] = token.replace(/""/g, '"');
  }

  return result;
}

/**
 * 2次元配列で表現されたCSVを、ヘッダー行をキーとしたオブジェクトの配列にする
 * @param  {Array.<string[]>} records
 * @return {Object[]}
 * @example
 * recordsToObjs([
 *   ["ブラウザ", "オペレーティング システム", "セッション"],
 *   ["Safari", "iOS", "1,625"]
 * ])
 * =>
 * [
 *   {"ブラウザ": "Safari", "オペレーティング システム": "iOS", "セッション": "1,625"}
 * ]
 */
function recordsToObjs(records) {
  const headers = records.shift();
  const total = records.pop();
  const results = [];
  let recordIndex = 0;
  let fieldIndex = 0;

  for (; recordIndex < records.length; recordIndex++) {
    const record = records[recordIndex];

    for(; fieldIndex < record.length; fieldIndex++) {
      const header = headers[fieldIndex];
      const field = record[fieldIndex];
      results[recordIndex] = results[recordIndex] || {};
      results[recordIndex][header] = field;
    }
    fieldIndex = 0;
  }

  return results
}

/**
 * オブジェクトにしたCSVからReportインスタンスを作る
 * @param  {Object[]} recordObjs
 * @return {Report[]}
 * @example
 * createReports([
 *   {"ブラウザ": "Safari", "オペレーティング システム": "iOS", "セッション": "1,625"}
 * ])
 * =>
 * [
 *   Report {browser: "Safari", os: "iOS", session: 1625}
 * ]
 */
function createReports(recordObjs) {
  return recordObjs.map(r => {
    return new Report({
      browser: r['ブラウザ'],
      os: r['オペレーティング システム'],
      session: parseFloat(r['セッション'].replace(/,/g, '')),
      newSessionRate: parseFloat(r['新規セッション率']),
      newVisit: parseFloat(r['新規ユーザー'].replace(/,/g, '')),
      bounceRate: parseFloat(r['直帰率']),
      pagePerSession: parseFloat(r['ページ/セッション']),
      avgSessionDuration: r['平均セッション時間']
    });
  });
}

/**
 * GAのレポートの一行を表すクラス
 */
class Report {
  /**
   * @param {string} $0.browser ブラウザ
   * @param {string} $0.os オペレーティング システム
   * @param {number} $0.session セッション
   * @param {number} $0.newSessionRate 新規セッション率
   * @param {number} $0.newVisit 新規ユーザー
   * @param {number} $0.bounceRate 直帰率
   * @param {number} $0.pagePerSession ページ/セッション
   * @param {string} $0.avgSessionDuration 平均セッション時間
   */
  constructor({
                browser,
                os,
                session,
                newSessionRate,
                newVisit,
                bounceRate,
                pagePerSession,
                avgSessionDuration
              }) {
    this.browser = browser;
    this.os = os;
    this.session = session;
    this.newSessionRate = newSessionRate;
    this.newVisit = newVisit;
    this.bounceRate = bounceRate;
    this.pagePerSession = pagePerSession;
    this.avgSessionDuration = avgSessionDuration;
  }
}

module.exports = parseSessionByBrowser;