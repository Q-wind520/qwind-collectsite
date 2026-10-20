import { describe, expect, it } from 'vitest';
import { convertPrompt, promptConversions } from '../../src/lib/prompt-convert';

const novelAiSample = `0.88::artist:maccha_(mochancc),artist:qys3,rella::jenmin12,1.2::artist:ashima_(roro046),betabeet,::kelou,masterpiece,location,{best quality},{{amazing quality}},very aesthetic,ultra-detailed,year 2024,year 2025

2::artist:m&m (mickey and mackey)::,year_2023,year_2024,


short hair with long locks,

headset,assault rifle,armband,holding gun,plaid skirt,pleated skirt,neck ribbonload bearing vest,black jacket,headphones,tactical clothes,white skirt,trigger discipline,suppressor,white shirt,collared shirt,helmet,plate carrier,gun sling,two-tone gloves,backpack,bulletproof vest,


headset,midriff,black gloves,baseball cap,ammunition pouch,bulletproof vest,tactical clothes,knee pads,crop top,goggles on headwear,`;

const animaSample = `(@maccha \\(mochancc\\), @qys3, rella:0.88), jenmin12, (@ashima \\(roro046\\), betabeet:1.2), kelou, masterpiece, location, (best quality:1.05), (amazing quality:1.1025), very aesthetic, ultra-detailed, year 2024, year 2025

(@m&m \\(mickey and mackey\\):2), year 2023, year 2024,


short hair with long locks,

headset, assault rifle, armband, holding gun, plaid skirt, pleated skirt, neck ribbonload bearing vest, black jacket, headphones, tactical clothes, white skirt, trigger discipline, suppressor, white shirt, collared shirt, helmet, plate carrier, gun sling, two-tone gloves, backpack, bulletproof vest,


headset, midriff, black gloves, baseball cap, ammunition pouch, bulletproof vest, tactical clothes, knee pads, crop top, goggles on headwear,`;

describe('convertPrompt', () => {
  it('converts the provided NovelAI sample to Anima', () => {
    const result = convertPrompt(novelAiSample, 'novelai', 'anima');
    expect(result.output).toBe(animaSample);
    expect(result.warnings).toEqual([]);
  });

  it('converts Anima weights, groups and artist tags back to NovelAI', () => {
    const result = convertPrompt(animaSample, 'anima', 'novelai');
    expect(result.output).toContain('0.88::artist:maccha_(mochancc), artist:qys3, rella::');
    expect(result.output).toContain('1.2::artist:ashima_(roro046), betabeet::');
    expect(result.output).toContain('2::artist:m&m_(mickey_and_mackey)::');
    expect(result.output).toContain('1.05::best quality::');
    expect(result.output).toContain('1.1025::amazing quality::');
    expect(result.warnings).toEqual([]);
  });

  it('converts simple weights and literals', () => {
    const result = convertPrompt('(masterpiece:1.5), (tag), \\(literal\\), @artist', 'anima', 'novelai');
    expect(result.output).toBe('1.5::masterpiece::, 1.1::tag::, (literal), artist:artist');
  });

  it('converts NovelAI braces by 1.05 and brackets by dividing 1.05, without rescaling weights', () => {
    const result = convertPrompt('1.2::artist:foo_bar::,{best quality},[a b],[[c]]', 'novelai', 'anima');
    expect(result.output).toBe(
      '(@foo bar:1.2), (best quality:1.05), (a b:0.9524), (c:0.907)',
    );
  });

  it('keeps score tags underscored and converts other underscores to spaces', () => {
    const result = convertPrompt('score_7, long_hair, year_2023', 'novelai', 'anima');
    expect(result.output).toBe('score_7, long hair, year 2023');
  });

  it('preserves natural language spacing when converting to NovelAI', () => {
    const result = convertPrompt('1girl, a quiet seaside village at sunset', 'anima', 'novelai');
    expect(result.output).toBe('1girl, a quiet seaside village at sunset');
  });

  it('accepts an unterminated numeric emphasis as applying to the end', () => {
    const result = convertPrompt('1.2::best quality', 'novelai', 'anima');
    expect(result.output).toBe('(best quality:1.2)');
    expect(result.warnings).toEqual([]);
  });

  it('warns on unbalanced input instead of throwing', () => {
    expect(convertPrompt('{{unclosed', 'novelai', 'anima').warnings.length).toBeGreaterThan(0);
    expect(convertPrompt('(unclosed', 'anima', 'novelai').warnings.length).toBeGreaterThan(0);
  });

  it('has both supported directions in the registry', () => {
    expect(promptConversions.map((item) => item.id)).toEqual(['anima-to-novelai', 'novelai-to-anima']);
  });
});
