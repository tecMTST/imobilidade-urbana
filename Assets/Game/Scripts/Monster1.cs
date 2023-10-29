using UnityEngine;
using System.Collections.Generic;
using Unity.VisualScripting;

public class Monster1 : MonoBehaviour
{
    public float delay = 2f;

    public UnityEngine.Rendering.Universal.Light2D light2D;
    public Transform playerObject;
    public Transform[] targetObject;
    public float moveSpeedNormal = 2f;
    public float moveSpeedLight = 5f;
    public GameObject player;
    public int monsterRoomIndex;
    private float stoppingDistance = 1f;

    private bool shouldMove = false;
    private Collider2D thisCollider;
    private bool isNearPlayer = false;
    private int index = 0;

    //Variáveis Áudio:
    [SerializeField] private float limitVoice = 8f;
    private float timerVoice = 0f;
    private int typeVoice = 1;

    //Compopnentes:
    private AudioSource audioSource;

    //Lista de SFX:
    [SerializeField] private AudioClip sfxVoice1;
    [SerializeField] private AudioClip sfxVoice2;

    void Start()
    {
        Invoke("StartMoving", delay);
        thisCollider = this.GetComponent<Collider2D>();
        audioSource = GetComponent<AudioSource>();
    }

    void Update()
    {
        List<Collider2D> colliders = new ();
        ContactFilter2D contactFilter = new ContactFilter2D();
        contactFilter.NoFilter();
        
        thisCollider.OverlapCollider(contactFilter, colliders);

        bool sameRoom = (monsterRoomIndex == player.GetComponent<PlayerController>().GetRoomIndex());

        if (colliders.Exists(item => item.CompareTag("NearPlayer"))) 
        {
            isNearPlayer = true;
        }
        else
        {
            isNearPlayer = false;
        }

        if (light2D.enabled && isNearPlayer && sameRoom)
        {
            Vector3 direction = playerObject.position - transform.position;
            direction.Normalize();
            transform.Translate(direction * moveSpeedLight * Time.deltaTime, Space.World);
        }
        else if (shouldMove)
        {
            Vector3 direction = targetObject[index].position - transform.position;
            

            if (direction.magnitude > stoppingDistance)
            {
                direction.Normalize();
                transform.Translate(direction * moveSpeedNormal * Time.deltaTime, Space.World);
            }
            else
            {
                shouldMove = false;
                Invoke("StartMoving", delay);

                if (index == targetObject.Length - 1)
                {
                    index = 0;
                }
                else
                {
                    index++;
                }
            }
        }

        //SFX Grunindos:
        timerVoice = timerVoice + Time.deltaTime;
        if (timerVoice > limitVoice)
        {
            switch (typeVoice)
            {
                case 1:
                    audioSource.PlayOneShot(sfxVoice1);
                    typeVoice = 2;
                    timerVoice = 0f;
                    break;

                case 2:
                    audioSource.PlayOneShot(sfxVoice2);
                    typeVoice = 1;
                    timerVoice = 0f;
                    break;
            }
        }

    }

    void StartMoving()
    {
        shouldMove = true;
    }
}
